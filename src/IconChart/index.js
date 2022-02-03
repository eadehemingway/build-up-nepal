import { useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { data } from "./../data/data";


const one_off_data = data.filter(d=> d["flag-status"] === "one-off").map(d=> ({ flag: d["flag-status"], status: d.Status }));
const enterprise_data = data.filter(d=> d["flag-status"] === "enterprise").map(d=> ({ flag: d["flag-status"], status: d.Status }));

const running_ent_data = enterprise_data.filter((d)=> d.status === "Running" );
const data_pending_ent_data = enterprise_data.filter((d)=> d.status === "Data pending" );
const closed_ent_data = enterprise_data.filter((d)=> d.status === "Closed / Sold" );
const struggling_ent_data = enterprise_data.filter((d)=> d.status === "Struggling" || d.status === "Running, Struggling" );

const enterprise_grouped = [running_ent_data, data_pending_ent_data, closed_ent_data, struggling_ent_data];


export function IconChart(){
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

    const flag_size = 20;
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
        const margin = { top: 80, left: 80 };
        one_off_data.forEach((d, i)=> {
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top;
            drawOneOffFlag(ctx, x, y);
        });

        const gap = 200;
        enterprise_grouped.forEach((data, i)=> {
            data.forEach((d, i)=> {
                const col_index = getColumn(i);
                const row_index = getRow(i);

                const x = getX(col_index) + margin.left;
                const y = getY(row_index) + margin.top + gap;
                drawEnterpriseFlag(ctx, x, y);

            });
        });

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
