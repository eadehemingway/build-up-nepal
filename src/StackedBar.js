import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";

export function StackedBar({ data, highlight, updateData }) {

    const [ctx_bottom, setCtxBottom] = useState(null);
    const [ctx_top, setCtxTop] = useState(null);

    function getBarId(x) {
        let filtered = data.filter(d => x >= d.x && x <= (d.x + d.width));
        if (!filtered.length) return null;
        return filtered[0].id;
    }

    const $canvas_bottom = useRef(null);
    const $canvas_top = useRef(null);
    const window_width = document.body.clientWidth;
    const chart_margin_left = 100;
    const chart_margin_right = 200;
    const chart_margin_top = 20;
    const chart_width = window_width - (chart_margin_left + chart_margin_right);
    const chart_height = 80;
    const regular_stroke_width = 0.5;
    const highlight_stroke_width = 2;

    function onMouseMove(e) {
        let x = e.clientX - chart_margin_left;
        const hovered_id = getBarId(x);
        if (hovered_id == null) return;
        updateData({
            filtered: [],
            highlighted: [hovered_id],
        });
    }

    function drawHighlight(ctx, h) {
        if (h === null) return;
        ctx.save();
        ctx.beginPath();
        ctx.rect(h.x - highlight_stroke_width, h.y - highlight_stroke_width, h.width + (highlight_stroke_width * 2), h.height + (highlight_stroke_width * 2)); // Outer
        ctx.rect(h.x + (regular_stroke_width / 2), h.y + (regular_stroke_width / 2), h.width - (regular_stroke_width / 2), h.height - (regular_stroke_width / 2)); // Inner
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill("evenodd");
        ctx.font = "13px serif";
        ctx.textAlign = "center";
        ctx.fillText(h.metric, (h.x + (h.width / 2)), h.y - 8);
        ctx.restore();
    }

    function drawStackedBar(ctx, d) {
        d.forEach(v => {
            ctx.save();
            ctx.fillStyle = v.filtered ? "pink" : "red";
            ctx.strokeStyle = "white";
            ctx.lineWidth = regular_stroke_width;
            ctx.fillRect(v.x, v.y, v.width, v.height);
            ctx.strokeRect(v.x, v.y, v.width, v.height);
            ctx.restore();
        });
    }

    useEffect(()=> {
        if (!$canvas_bottom.current) return;
        setCtxBottom($canvas_bottom.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas_bottom.current) return;
        if (!ctx_bottom) return;
        ctx_bottom.scale(2, 2);
        ctx_bottom.translate(chart_margin_left, chart_margin_top);
        drawStackedBar(ctx_bottom, data);
    }, [ctx_bottom]);

    useEffect(()=>{
        if (!ctx_bottom) return;
        ctx_bottom.save();
        ctx_bottom.translate(-chart_margin_left, -chart_margin_top);
        ctx_bottom.clearRect(-(regular_stroke_width), -(regular_stroke_width), window_width + (regular_stroke_width / 2), chart_height + (regular_stroke_width / 2));
        ctx_bottom.restore();
        drawStackedBar(ctx_bottom, data);
    }, [data]);




    useEffect(()=> {
        if (!$canvas_top.current) return;
        setCtxTop($canvas_top.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas_top.current) return;
        if (!ctx_top) return;
        ctx_top.clearRect(0, 0, window_width, chart_height);
        ctx_top.scale(2, 2);
        ctx_top.translate(chart_margin_left, chart_margin_top);
        drawHighlight(ctx_top, highlight);
    }, [ctx_top]);

    useEffect(()=>{
        if (!ctx_top) return;
        ctx_top.save();
        ctx_top.translate(-chart_margin_left, -chart_margin_top);
        ctx_top.clearRect(-(highlight_stroke_width), -(highlight_stroke_width), window_width + (highlight_stroke_width / 2), chart_height + (highlight_stroke_width / 2));
        ctx_top.restore();
        drawHighlight(ctx_top, highlight);
    }, [highlight]);




    return (
        <CanvasContainer>
            <CanvasBottom onMouseMove={onMouseMove} ref={$canvas_bottom} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
            <CanvasTop ref={$canvas_top} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
        </CanvasContainer>
    );
}

const CanvasContainer = styled.div`
    width: 100%;
    display: inline-block;
    margin: 0px;
    padding: 0px;
    position: relative;
`;

const CanvasBottom = styled.canvas`
    width: 100%;
    height: ${({ chart_height })=>chart_height}px;
    display: inline-block;
    margin: 0px;
    padding: 0px;
    z-index: 1;
`;

const CanvasTop = styled(CanvasBottom)`
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 2;
    pointer-events: none;
`;


