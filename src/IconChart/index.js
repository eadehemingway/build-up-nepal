import { useRef, useEffect } from "react";
import styled from "styled-components";
import { one_off_data, ordered_ent_data, order, blue_red_gap, getFlagId, y_ranges_per_section, LOOKUP } from "./process_data";
import { margin, COLUMNS , red_gap, flag_height, flag_width, flag_cell_height, flag_cell_width } from "./constants";
import { dark_blue, dark_pink, red } from "../shared/colors";

export function IconChart({ width, height, setHighlightLocked, highlight_id, setHighlightId, highlight_locked }){
    const $canvas = useRef(null);
    const text_padding = 10;
    const title_size = 16;
    const subtitle_size = 12;

    function getFlagSize(width, height) {
        console.log(ordered_ent_data);
    }

    getFlagSize(width, height);

    function drawOneOffFlag(ctx, x, y, should_fill){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.strokeStyle = dark_blue;
        ctx.lineWidth = 0.5;

        const point_one = { x: 0, y: 0 };
        const point_two = { x: flag_width, y: flag_height/2 };
        const point_three = { x: 0, y: flag_height };
        ctx.moveTo(point_one.x, point_one.y);
        ctx.lineTo(point_two.x, point_two.y);
        ctx.lineTo(point_three.x, point_three.y);
        ctx.closePath();
        ctx.translate(-x, -y);
        ctx.fillStyle = should_fill ? dark_blue: dark_pink;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function drawEnterpriseFlag(ctx, x, y, should_fill){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.strokeStyle = red;
        ctx.lineWidth = 0.5;
        const point_one = { x: 0, y: 0 };
        const point_two = { x: flag_width, y: 0 };
        const point_three = { x: flag_width/2, y: flag_height/2 };
        const point_four = { x: flag_width , y: flag_height };
        const point_five = { x: 0 , y: flag_height };
        ctx.moveTo(point_one.x, point_one.y);
        ctx.lineTo(point_two.x, point_two.y);
        ctx.lineTo(point_three.x, point_three.y);
        ctx.lineTo(point_four.x, point_four.y);
        ctx.lineTo(point_five.x, point_five.y);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = should_fill ? red: dark_pink;
        ctx.fill();
        ctx.translate(-x, -y);
        ctx.restore();

    }

    const getX = (column_index) => column_index * flag_cell_width;
    const getY = (row_index) => row_index * flag_cell_height;
    const getColumn = (i) =>  i % COLUMNS;
    const getRow = (i) =>  Math.floor(i / COLUMNS);
    const getRedOffset = (status) =>  order.findIndex(d=> d === status) * red_gap;

    useEffect(()=> {
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.scale(2, 2);

    },[]);

    function drawLabel({ ctx, label, x, y, color, fontSize, weight }){
        ctx.font = `${weight || "normal"} ${fontSize}px code-saver, sans-serif`;
        ctx.fillStyle = color;
        ctx.fillText(label, x, y);

    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function drawOneOffFlags(ctx){
        const color = dark_blue;
        drawLabel({ ctx, label: "One-off projects", x: margin.left, y: margin.top - (text_padding *2), color, fontSize: title_size, weight: "bold" });
        const x = margin.left + (COLUMNS * flag_cell_width);
        drawLabel({ ctx, label: "Projects", x: x + 10, y: margin.top + text_padding, color, fontSize: subtitle_size });
        drawLabel({ ctx, label: one_off_data.length, x: x + 10, y: margin.top + 15 + text_padding, color, fontSize: subtitle_size });
        one_off_data.forEach((d, i)=> {
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top;
            const should_fill = highlight_id === d.id;

            drawOneOffFlag(ctx, x, y, should_fill );
        });
    }

    function drawEnterpriseFlags(ctx){
        const color = red;
        drawLabel({ ctx, label: "Enterprise", x: margin.left, y: blue_red_gap + margin.top - (2 *text_padding), color, fontSize: title_size, weight: "bold" });
        const x = margin.left + (COLUMNS * flag_cell_width);
        order.forEach((s, i)=> {
            const label = capitalizeFirstLetter(s.toLowerCase());
            const min_y = y_ranges_per_section[i][0] + margin.top + text_padding;
            drawLabel({ ctx, label, x: x + 10, y:min_y, red, fontSize: subtitle_size });
            const total = LOOKUP[s].length;
            drawLabel({ ctx, label: total, x: x + 10, y: min_y + 15, red, fontSize:subtitle_size });
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
    }

    useEffect(()=>{
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.clearRect(0, 0, width * 2, height * 2);
        drawOneOffFlags(ctx);
        drawEnterpriseFlags(ctx);
    }, [highlight_id]);

    function onMouseMove(e) {
        if(!highlight_locked){
            const ID = getHighlightId(e);
            setHighlightId(ID);
        }
    }

    function onMouseOut() {
        if (!highlight_locked){
            setHighlightId(null);
        }
    }

    function getHighlightId(e) {
        let x = e.pageX - margin.left;
        let y = e.pageY - margin.top;
        return getFlagId(x, y);
    }

    function onClick(e) {
        e.stopPropagation();
        const ID = getHighlightId(e);
        setHighlightId(ID);
        if (!ID) {
            setHighlightLocked(false);
            return;
        }
        setHighlightLocked(true);
    }


    return (
        <Canvas onMouseMove={onMouseMove} onClick={onClick} onMouseOut={onMouseOut} width={width * 2} height={height * 2} ref={$canvas} id="icon-chart"/>
    );
}

const Canvas = styled.canvas`
    width: ${({ width }) => width / 2 }px;
    height: ${({ height }) => height / 2 }px;
    display: inline-block;
    margin: 0px;
    padding: 0px;
    cursor: pointer;
`;


