import { useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { data } from "./../data/data";


const one_off_data = data.filter(d=> d["flag-status"] === "one-off").map(d=> ({ flag: d["flag-status"], status: d.Status }));
const enterprise_data = data.filter(d=> d["flag-status"] === "enterprise").map(d=> ({ flag: d["flag-status"], status: d.Status }));
console.log("enterprise_data:", enterprise_data);


export function IconChart(){
    const $canvas = useRef(null);
    function drawOneOffFlag(ctx, x, y){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0.05 * flag_size, 0.2 * flag_size);
        ctx.lineTo(0.95 * flag_size, 0.5 * flag_size);
        ctx.lineTo(0.05 * flag_size, 0.85 * flag_size);
        ctx.closePath();
        ctx.translate(-x, -y);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.restore();
    }

    function drawEnterpriseFlag(ctx, x, y){
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0.05 * flag_size, 0.2 * flag_size);
        ctx.lineTo(0.95 * flag_size, 0.2 * flag_size);
        ctx.lineTo(0.5 * flag_size, 0.5 * flag_size);
        ctx.lineTo(0.95 * flag_size, 0.85 * flag_size);
        ctx.lineTo(0.05 * flag_size, 0.85 * flag_size);
        ctx.closePath();
        ctx.translate(-x, -y);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();
    }

    const flag_size = 10;
    const columns = 8;

    function getX(column_index){
        return column_index * flag_size;
    }

    function getY(row_index){
        return row_index * flag_size;
    }

    function getColumn(i){
        const column_index = i % columns;
        return column_index;
    }

    function getRow(i){
        const row_index = Math.floor(i / columns);
        return row_index;
    }

    useEffect(()=>{
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.clearRect(0, 0, 800, 800);
        ctx.scale(2, 2);
        const x = 100;
        const y = 100;
        drawOneOffFlag(ctx, x, y);
        drawEnterpriseFlag(ctx, x*2, y*2);
    }, []);

    return (
        <Canvas width={800} height={2000} ref={$canvas} id="icon-chart"/>
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
