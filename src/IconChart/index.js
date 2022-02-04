import { useRef, useEffect } from "react";
import styled from "styled-components";
import {  one_off_data , ordered_ent_data, order, blue_red_gap, getFlagId, y_ranges_per_section, LOOKUP } from "./process_data";
import { flag_size, margin, COLUMNS , red_gap } from "./constants";

export function IconChart({ highlight_id, setHighlightId }){
    const $canvas = useRef(null);
    const text_padding = 10;
    const title_size = 16;
    const subtitle_size = 13;

    function drawOneOffFlag(ctx, x, y, should_fill){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 0.4;
        const flag_width = 10;
        const flag_height = 10;
        const point_one = { x: 0, y: 0 };
        const point_two = { x: flag_width, y: flag_height/2 };
        const point_three = { x: 0, y: flag_height };
        ctx.moveTo(point_one.x, point_one.y);
        ctx.lineTo(point_two.x, point_two.y);
        ctx.lineTo(point_three.x, point_three.y);
        ctx.closePath();
        ctx.translate(-x, -y);
        ctx.fillStyle = should_fill ? "blue": "#FDC5FF";
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
        const flag_width = 10;
        const flag_height = 10;
        const point_one = { x: 0, y: 0 };
        const point_two = { x: flag_width, y: 0 };
        const point_three = { x: flag_width/3, y: flag_height/2 };
        const point_four = { x: flag_width , y: flag_height };
        const point_five = { x: 0 , y: flag_height };
        ctx.moveTo(point_one.x, point_one.y);
        ctx.lineTo(point_two.x, point_two.y);
        ctx.lineTo(point_three.x, point_three.y);
        ctx.lineTo(point_four.x, point_four.y);
        ctx.lineTo(point_five.x, point_five.y);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = should_fill ? "red": "#fdc0ff";
        ctx.fill();
        ctx.translate(-x, -y);
        ctx.restore();

    }

    const getX = (column_index) => column_index * flag_size;
    const getY = (row_index) => row_index * flag_size;
    const getColumn = (i) =>  i % COLUMNS;
    const getRow = (i) =>  Math.floor(i / COLUMNS);
    const getRedOffset = (status) =>  order.findIndex(d=> d === status) * red_gap;

    useEffect(()=> {
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.scale(2, 2);

    },[]);

    function drawLabel({ ctx, label, x, y, color, fontSize }){
        ctx.font = `${fontSize}px code-saver, sans-serif`;
        ctx.fillStyle = color;
        ctx.fillText(label, x, y);

    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function drawOneOffFlags(ctx){
        const color = "blue";
        drawLabel({ ctx, label: "One-off projects", x: margin.left, y: margin.top - text_padding, color, fontSize: title_size });
        const x = margin.left + (COLUMNS * flag_size);
        drawLabel({ ctx, label: "Projects", x, y: margin.top + text_padding, color, fontSize: subtitle_size });
        drawLabel({ ctx, label: one_off_data.length, x, y: margin.top + 15 + text_padding, color, fontSize: subtitle_size });
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
        const color = "red";
        drawLabel({ ctx, label: "Enterprise", x: margin.left, y: blue_red_gap + margin.top - text_padding, color, fontSize: title_size });
        const x = margin.left + (COLUMNS * flag_size);
        order.forEach((s, i)=> {
            const label = capitalizeFirstLetter(s.toLowerCase());
            const min_y = y_ranges_per_section[i][0] + margin.top + text_padding;
            drawLabel({ ctx, label, x, y:min_y, color, fontSize:subtitle_size });
            const total = LOOKUP[s].length;
            drawLabel({ ctx, label: total, x, y: min_y + 15, color, fontSize:subtitle_size });
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
        ctx.clearRect(0, 0, 800, 1600);
        drawOneOffFlags(ctx);
        drawEnterpriseFlags(ctx);
    }, [highlight_id]);

    function onMouseMove(e) {
        let x = e.pageX - margin.left;
        let y = e.pageY - margin.top;
        const ID = getFlagId(x, y);
        setHighlightId(ID);
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
`;


