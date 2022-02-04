import { useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { data } from "./../data/data";

const columns = 8;
const flag_size = 20;
const one_off_data = data.filter(d=> d["flag-status"] === "one-off").map(d=>{
    return  { flag: d["flag-status"], status: d.Status, id: d["#"] };
});

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
const combo = order.map(d=> LOOKUP[d]).flat();

const margin = { top: 80, left: 80 };
const red_blue_padding = 3 * flag_size;
const blue_red_gap = total_rows_one_off * flag_size + red_blue_padding;
const red_gap = flag_size * 2;



export function IconChart({ highlight_id, setHighlightId }){
    const $canvas = useRef(null);
    function drawOneOffFlag(ctx, x, y){
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
        ctx.stroke();
        ctx.restore();
    }

    function drawEnterpriseFlag(ctx, x, y){
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
        ctx.translate(-x, -y);
        ctx.restore();
    }


    const getX = (column_index) => column_index * flag_size;
    const getY = (row_index) => row_index * flag_size;
    const getColumn = (i) =>  i % columns;
    const getRow = (i)=>  Math.floor(i / columns);


    useEffect(()=>{
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.clearRect(0, 0, 800, 800);
        ctx.scale(2, 2);
        one_off_data.forEach((d, i)=> {
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top;
            drawOneOffFlag(ctx, x, y);
        });

        combo.forEach((data, i)=> {
            const offset_from_status = getOffset(data.status);
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top + blue_red_gap + offset_from_status;
            drawEnterpriseFlag(ctx, x, y);
        });

    }, []);

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

    function getFlagIdOfEntFlags(x, y){
        /// get y ranges that determine which section you are looking at.
        const rows_per_section = getSectionRowNums();
        const height_per_section = rows_per_section.map(r=> r * flag_size);
        let prev_height = 0;
        console.log("--------------------------");
        let prev_data = [];
        const y_range_per_section = height_per_section.map((h, i)=>{
            // calculate the red_gaps val
            let start_index = 0;
            let red_gap_adjusted = 0;
            if (i > 0){
                start_index = getStartIndex(prev_data);
                red_gap_adjusted = start_index === 0 ? red_gap : red_gap - flag_size;
            }
            prev_data += LOOKUP[order[i]];
            // calculate min and max based on that.
            const min_y = prev_height + red_gap_adjusted;// prev_height should be the max val
            const max_y = min_y + h;
            prev_height = max_y;
            return [min_y, max_y];
        });
        console.log("y_range_per_section:", y_range_per_section);


        console.log("--------------------------");




    }
    function getFlagId(x, y){
        // if no sub gaps
        const row_if_no_gaps = Math.floor(y / flag_size);
        const col = Math.floor(x / flag_size);
        let highlighted_id;

        const is_one_off = row_if_no_gaps < total_rows_one_off;
        if (is_one_off){
            const index = (row_if_no_gaps * columns) + col;
            highlighted_id = one_off_data[index]?.id;
        }else{
            highlight_id = getFlagIdOfEntFlags(x, y);

        }
        return highlighted_id || null;
    }
    function onMouseMove(e) {
        let x = e.clientX - margin.left;
        let y = e.clientY - margin.top;
        const ID = getFlagId(x, y);
        if (ID == null) return;
        setHighlightId(ID);
    }

    function getOffset(status){
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
