import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";

export function StackedBar({ data, highlight_id, updateData, chart_margin, chart_size, bar_size }) {

    const [ctx_bottom, setCtxBottom] = useState(null);
    const [ctx_top, setCtxTop] = useState(null);

    function getBarId(x) {
        let filtered = data.filter(d => x >= d.x && x <= (d.x + d.width));
        if (!filtered.length) return null;
        return filtered[0].id;
    }

    const $canvas_bottom = useRef(null);
    const $canvas_top = useRef(null);

    const regular_stroke_width = 0.3;
    const highlight_stroke_width = 2;

    function onMouseMove(e) {
        let x = e.clientX - chart_margin.left;
        const hovered_id = getBarId(x);
        if (hovered_id == null) return;
        updateData({
            filtered: [],
            highlighted: [hovered_id],
        });
    }

    function onMouseOut() {
        updateData({
            filtered: [],
            highlighted: null,
        });
    }

    function transformCanvas(ctx) {
        ctx.scale(2, 2);
        ctx.translate(chart_margin.left, chart_margin.top);
    }

    function clearCanvas(ctx) {
        ctx.save();
        ctx.translate(-chart_margin.left, -chart_margin.top);
        ctx.clearRect(-(highlight_stroke_width), -(highlight_stroke_width), chart_size.width + (highlight_stroke_width / 2), chart_size.height + (highlight_stroke_width / 2));
        ctx.restore();
    }

    function drawHighlight(ctx, highlight_id) {
        const highlight = data.find((d)=> d.id === highlight_id );
        clearCanvas(ctx);
        if (!highlight) return;
        ctx.save();
        ctx.beginPath();
        ctx.rect(highlight.x - highlight_stroke_width, highlight.y - highlight_stroke_width, highlight.width + (highlight_stroke_width * 2), highlight.height + (highlight_stroke_width * 2)); // Outer
        ctx.rect(highlight.x + (regular_stroke_width / 2), highlight.y + (regular_stroke_width / 2), highlight.width - (regular_stroke_width / 2), highlight.height - (regular_stroke_width / 2)); // Inner
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill("evenodd");
        ctx.font = "13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(highlight.metric, (highlight.x + (highlight.width / 2)), highlight.y - 8);
        ctx.restore();
    }

    function drawStackedBar(ctx, d) {
        clearCanvas(ctx);
        d.forEach(v => {
            ctx.save();
            ctx.fillStyle = v.filtered ? "pink" : "red";
            ctx.strokeStyle = "white";
            ctx.lineWidth = regular_stroke_width;
            ctx.fillRect(v.x, v.y, v.width, v.height);
            ctx.strokeRect(v.x, v.y, v.width, v.height);
            ctx.restore();
        });

        ctx.textAlign = "left";
        ctx.font = "25px sans-serif";
        ctx.fillStyle = "red";
        ctx.fillText(d.total, bar_size.width + 10, bar_size.height);
        ctx.fillStyle = "#000000";
        ctx.font = "13px sans-serif";
        ctx.fillText(d.name, bar_size.width + 10, 10);
    }

    useEffect(()=> {
        if (!$canvas_bottom.current) return;
        setCtxBottom($canvas_bottom.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas_bottom.current) return;
        if (!ctx_bottom) return;
        transformCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data);
    }, [ctx_bottom]);

    useEffect(()=>{
        if (!ctx_bottom) return;
        drawStackedBar(ctx_bottom, data);
    }, [data]);


    useEffect(()=> {
        if (!$canvas_top.current) return;
        setCtxTop($canvas_top.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas_top.current) return;
        if (!ctx_top) return;
        transformCanvas(ctx_top);
        drawHighlight(ctx_top, highlight_id);
    }, [ctx_top]);

    useEffect(()=>{
        if (!ctx_top) return;
        drawHighlight(ctx_top, highlight_id);
    }, [highlight_id]);


    return (
        <CanvasContainer>
            <CanvasBottom onMouseMove={onMouseMove} onMouseOut={onMouseOut} ref={$canvas_bottom} width={chart_size.width * 2} height={chart_size.height * 2} chart_height={chart_size.height}/>
            <CanvasTop ref={$canvas_top} width={chart_size.width * 2} height={chart_size.height * 2} chart_height={chart_size.height}/>
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


