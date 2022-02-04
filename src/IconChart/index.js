import { useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { data } from "./../data/data";

const columns = 8;
const flag_size = 20;
const one_off_data = data.filter(d=> d["flag-status"] === "one-off").map(d=>({ flag: d["flag-status"], status: d.Status, id: d["#"] }));

const getStartIndex = (prev_data) => prev_data.length % columns;
const getTotalRows = (data, col_start_index) =>  Math.ceil((data.length + col_start_index)/ columns);

const total_rows_one_off = getTotalRows(one_off_data, 0);
const enterprise_data = data.filter(d=> d["flag-status"] === "enterprise").map(d=> ({ flag: d["flag-status"], status: d.Status, id: d["#"] }));

const running_ent_data = enterprise_data.filter((d)=> d.status === "Running" ).map(d=> ({ ...d, status: "RUNNING" }));
const data_pending_ent_data = enterprise_data.filter((d)=> d.status === "Data pending" ).map(d=> ({ ...d, status: "PENDING" }));

const closed_ent_data = enterprise_data.filter((d)=> d.status === "Closed / Sold" ).map(d=> ({ ...d, status: "CLOSED" }));
const struggling_ent_data = enterprise_data.filter((d)=> d.status === "Struggling" || d.status === "Running, Struggling" ).map(d=> ({ ...d, status: "STRUGGLING" }));

const order = ["RUNNING", "STRUGGLING", "CLOSED", "PENDING"];
const LOOKUP = {
    RUNNING: running_ent_data,
    STRUGGLING: struggling_ent_data,
    PENDING: data_pending_ent_data,
    CLOSED: closed_ent_data
};
const ordered_ent_data = order.map(d=> LOOKUP[d]).flat();

const margin = { top: 80, left: 80 };
const red_blue_padding = 3 * flag_size;
const blue_red_gap = total_rows_one_off * flag_size + red_blue_padding;
const red_gap = flag_size * 2;



export function IconChart({ highlight_id, setHighlightId }){
    const $canvas = useRef(null);

    function drawOneOffFlag(ctx, x, y, should_fill){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 0.4;
        ctx.moveTo(0.05 * flag_size, 0.2 * flag_size);
        ctx.lineTo(0.95 * flag_size, 0.5 * flag_size);
        ctx.lineTo(0.05 * flag_size, 0.85 * flag_size);
        ctx.closePath();
        ctx.translate(-x, -y);
        ctx.fillStyle = should_fill ? "blue": "rgba(0, 0, 0, 0)";
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function drawEnterpriseFlag(ctx, x, y, should_fill){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 0.4;
        ctx.moveTo(0.05 * flag_size, 0.2 * flag_size);
        ctx.lineTo(0.95 * flag_size, 0.2 * flag_size);
        ctx.lineTo(0.5 * flag_size, 0.5 * flag_size);
        ctx.lineTo(0.95 * flag_size, 0.85 * flag_size);
        ctx.lineTo(0.05 * flag_size, 0.85 * flag_size);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = should_fill ? "red": "rgba(0, 0, 0, 0)";
        ctx.fill();
        ctx.translate(-x, -y);
        ctx.restore();
    }


    const getX = (column_index) => column_index * flag_size;
    const getY = (row_index) => row_index * flag_size;
    const getColumn = (i) =>  i % columns;
    const getRow = (i)=>  Math.floor(i / columns);

    useEffect(()=> {
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.scale(2, 2);

    },[]);

    useEffect(()=>{
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.clearRect(0, 0, 800, 1600);
        one_off_data.forEach((d, i)=> {
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top;
            const should_fill = highlight_id === d.id;

            drawOneOffFlag(ctx, x, y, should_fill );
        });

        ordered_ent_data.forEach((data, i)=> {
            const offset_from_status = getRedOffset(data.status);
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top + blue_red_gap + offset_from_status;
            const should_fill = highlight_id === data.id;
            drawEnterpriseFlag(ctx, x, y, should_fill);
        });

    }, [highlight_id]);

    // get how many rows are in each section (slighty tricky because you need to know what column index you start at)
    function getSectionRowNums(){
        const row_nums = order.map((s, i)=> {
            const data = LOOKUP[s];
            if (i === 0) {
                const rows = getTotalRows(data, 0);
                return rows;
            }else{
                const prev_data = LOOKUP[order[i-1]];
                const start_index = getStartIndex(prev_data);
                const rows = getTotalRows(data, start_index);
                return rows;
            }
        });
        return row_nums;
    }
    function getYRangesPerSection(){
        const rows_per_section = getSectionRowNums();
        const height_per_section = rows_per_section.map(r=> r * flag_size);
        let prev_height = 0;
        let prev_data = [];
        const y_range_per_section = height_per_section.map((h, i)=>{
            let start_index = 0;
            let red_gap_adjusted = 0;
            if (i > 0){
                start_index = getStartIndex(prev_data);
                red_gap_adjusted = start_index === 0 ? red_gap : red_gap - flag_size;
            }
            prev_data += LOOKUP[order[i]];
            const min_y = prev_height + red_gap_adjusted;
            const max_y = min_y + h;
            prev_height = max_y;
            return [min_y, max_y];
        }).map(arr=> ([arr[0] + blue_red_gap, arr[1] + blue_red_gap]));
        return y_range_per_section;
    }

    function getAccumalativePrevData(i){
        let prev_data= [];
        for(let j = 0; j < i; j ++){
            const data = LOOKUP[order[j]];
            prev_data = [...prev_data, ...data];
        }
        return prev_data;

    }
    function getFlagIdOfEntFlags(x, y){
        const y_ranges_per_section = getYRangesPerSection();
        const section_index = y_ranges_per_section.reduce((acc, range, i)=>{
            if (y > range[0] && y < range[1]) return i;
            return acc;
        }, null);

        const status = order[section_index];
        if (section_index=== undefined || section_index === null) return null;
        const min_section_val = y_ranges_per_section[section_index][0];

        const relative_y = y - min_section_val;

        const rows = Math.floor(relative_y/ flag_size);
        const col = Math.floor(x / flag_size);

        const prev_data = getAccumalativePrevData(section_index);// needs to be accumulative
        const start_index = getStartIndex(prev_data);

        const index = (rows * columns) + col - start_index;

        const data = LOOKUP[status];

        const highlighted_id = data ? data[index]?.id: null;

        return highlighted_id;

    }

    function getFlagId(x, y){
        // if no sub gaps
        const row_if_no_gaps = Math.floor(y / flag_size);
        const col = Math.floor(x / flag_size);
        console.log("col:", col);
        if (col > 7 || col < 0) return null;
        let highlighted_id;

        const is_one_off = row_if_no_gaps < total_rows_one_off;
        if (is_one_off){
            const index = (row_if_no_gaps * columns) + col;
            highlighted_id = one_off_data[index]?.id;
        }else{
            highlighted_id = getFlagIdOfEntFlags(x, y);
        }
        return highlighted_id || null;
    }
    function onMouseMove(e) {
        let x = e.pageX - margin.left;
        let y = e.pageY - margin.top;
        const ID = getFlagId(x, y);
        setHighlightId(ID);
    }

    function getRedOffset(status){
        const order_index = order.findIndex(d=> d === status);
        return order_index * red_gap;
    }

    return (
        <Canvas onMouseMove={onMouseMove}  width={800} height={2000} ref={$canvas} id="icon-chart"/>
    );
}

const Canvas = styled.canvas`
    width: 400px;
    height: 1000px;
    display: inline-block;
    margin: 0px;
    padding: 0px;
    z-index: 1;
    border: 2px solid red;
`;


