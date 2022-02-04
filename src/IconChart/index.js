import { useRef, useEffect } from "react";
import styled from "styled-components";
import {  one_off_data , ordered_ent_data, order, blue_red_gap, getFlagId } from "./process_data";
import { flag_size, margin, COLUMNS , red_gap } from "./constants";


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
    const getColumn = (i) =>  i % COLUMNS;
    const getRow = (i) =>  Math.floor(i / COLUMNS);
    const getRedOffset = (status) =>  order.findIndex(d=> d === status) * red_gap;

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
    z-index: 1;
    border: 2px solid red;
`;


