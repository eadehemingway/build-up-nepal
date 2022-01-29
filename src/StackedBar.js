import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";

export function StackedBar({ data, updateData }) {

    const [ctx, setCtx] = useState(null);

    function getBar(x) {
        let filtered = data.filter(d => x >= d.x && x <= (d.x + d.width));
        if (!filtered.length) return null;
        return data.findIndex(e => e.id === filtered[0].id);
    }

    const $canvas = useRef(null);
    const window_width = document.body.clientWidth;
    const chart_height = 80;

    function onMouseMove(e) {
        let x = e.clientX;
        const hovered = getBar(x);
        if (hovered == null) return;
        console.log(data);
        updateData({
            filter: [],
            highlight: [hovered],
        });
    }

    function drawStackedBar(ctx, d) {
        d.forEach(v => {
            ctx.fillStyle = v.highlighted ? "blue" : "red";
            ctx.strokeStyle = "white";
            ctx.lineWidth = "0.5";
            ctx.fillRect(v.x, v.y, v.width, v.height);
            ctx.strokeRect(v.x, v.y, v.width, v.height);
        });
    }

    useEffect(()=> {
        if (!$canvas.current) return;
        setCtx($canvas.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas.current) return;
        if (!ctx) return;
        ctx.clearRect(0, 0, window_width, chart_height);
        ctx.scale(2, 2);
        drawStackedBar(ctx, data);
    }, [ctx]);

    useEffect(()=>{
        if (!ctx) return;
        drawStackedBar(ctx, data);
    }, [data]);

    return (
        <Canvas onMouseMove={onMouseMove} ref={$canvas} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
    );
}

const Canvas = styled.canvas`
    width: 100%;
    height: ${({ chart_height })=>chart_height}px;
    display: inline-block;
    margin: 0px;
    padding: 0px;
`;


