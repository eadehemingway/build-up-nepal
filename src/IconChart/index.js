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

const combo = [running_ent_data, struggling_ent_data, closed_ent_data, data_pending_ent_data].flat();

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
    const getX = (column_index) => column_index * flag_size;
    const getY = (row_index) => row_index * flag_size;
    const getColumn = (i) =>  i % columns;
    const getRow = (i)=>  Math.floor(i / columns);


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
        combo.forEach((data, i)=> {
            const offset_from_status = getOffset(data.status);
            const col_index = getColumn(i);
            const row_index = getRow(i);
            const x = getX(col_index) + margin.left;
            const y = getY(row_index) + margin.top + gap + offset_from_status;
            drawEnterpriseFlag(ctx, x, y);
        });

    }, []);

    function getOffset(status){
        const gap = 40;
        // these need to be in the order of the array above
        if (status === "Running") return 0;
        if (status === "Struggling" || status === "Running, Struggling") return gap;
        if (status === "Closed / Sold") return gap * 2;
        if (status === "Data pending") return gap * 3;
    }

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
