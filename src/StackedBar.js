import React, { useEffect, useState, useRef } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";

export function StackedBar({ data }) {

    const $canvas = useRef(null);
    const window_width = document.body.clientWidth;
    const chart_height = 80;

    function drawStackedBar(ctx, metric) {
        metric.forEach(v => {
            ctx.fillStyle = "red";
            ctx.strokeStyle = "white";
            ctx.fillRect(v.x, v.y, v.width, v.height);
            ctx.strokeRect(v.x, v.y, v.width, v.height);
        });
    }

    useEffect(()=>{
        if (!$canvas.current) return;
        const ctx = $canvas.current.getContext("2d");
        ctx.scale(2, 2);
        drawStackedBar(ctx, data);
    }, [data]);

    return (
        <Canvas ref={$canvas} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
    );
}

const Canvas = styled.canvas`
    width: 100%;
    height: ${({ chart_height })=>chart_height}px;
    display: inline-block;
    margin: 0px;
    padding: 0px;
`;


