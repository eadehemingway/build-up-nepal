import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";

export function StackedBar({ data, highlight_id, setHighlightId, updateData, chart_margin, window_width, chart_height, sort_by }) {

    const [ctx_bottom, setCtxBottom] = useState(null);
    const [ctx_top, setCtxTop] = useState(null);

    function getBarId(x) {
        let filtered = data.data.filter(function(d) {
            let d_x = d.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            let d_width = d.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            return x >= d_x && x <= (d_x + d_width);
        });
        if (!filtered.length) return null;
        return filtered[0].id;
    }

    const $canvas_bottom = useRef(null);
    const $canvas_top = useRef(null);

    const regular_stroke_width = 0.3;
    const highlight_stroke_width = 2;

    function onMouseMove(e) {
        let x = e.clientX - chart_margin.left;
        const ID = getBarId(x);
        if (ID == null) return;
        setHighlightId(ID);
        // updateData({
        //     filtered: [],
        // });
    }

    function onMouseOut() {
        setHighlightId(null);
        updateData({
            filtered: [],
            highlighted: null,
        });
    }

    function transformCanvas(ctx) {
        ctx.resetTransform();
        ctx.scale(2, 2);
        ctx.translate(chart_margin.left, chart_margin.top);
    }

    function clearCanvas(ctx) {
        ctx.save();
        ctx.translate(-chart_margin.left, -chart_margin.top);
        ctx.clearRect(-(highlight_stroke_width), -(highlight_stroke_width), window_width + (highlight_stroke_width / 2), chart_height + (highlight_stroke_width / 2));
        ctx.restore();
    }

    function drawHighlight(ctx, highlight_id) {
        const highlight = data.data.find(d => d.id === highlight_id);
        clearCanvas(ctx);
        if (!highlight) return;
        let highlight_x = highlight.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
        let highlight_width = highlight.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
        ctx.save();
        ctx.beginPath();
        ctx.rect(highlight_x - highlight_stroke_width, highlight.y - highlight_stroke_width, highlight_width + (highlight_stroke_width * 2), highlight.height + (highlight_stroke_width * 2)); // Outer
        ctx.rect(highlight_x + (regular_stroke_width / 2), highlight.y + (regular_stroke_width / 2), highlight_width - (regular_stroke_width / 2), highlight.height - (regular_stroke_width / 2)); // Inner
        ctx.closePath();
        ctx.fillStyle = "#1400a3";
        ctx.fill("evenodd");
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(highlight.value.metric, (highlight_x + (highlight_width / 2)), highlight.y - 8);
        ctx.restore();
    }

    function drawStackedBar(ctx, d) {
        clearCanvas(ctx);
        d.data.forEach(v => {
            let x = v.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            let width = v.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            ctx.save();
            ctx.fillStyle = v.filtered ? "pink" : "red";
            ctx.strokeStyle = "#FFD6FF";
            ctx.lineWidth = regular_stroke_width;
            ctx.fillRect(x, v.y, width, v.height);
            ctx.strokeRect(x, v.y, width, v.height);
            ctx.restore();
        });

        ctx.textAlign = "left";
        ctx.font = "38px sans-serif";
        ctx.fillStyle = "red";
        ctx.fillText(d.total, (window_width - (chart_margin.left + chart_margin.right)) + 10, chart_height - (chart_margin.top + chart_margin.bottom));
        ctx.fillStyle = "#1400a3";
        ctx.font = "12px sans-serif";
        ctx.fillText(d.name, (window_width - (chart_margin.left + chart_margin.right)) + 10, -8);
    }

    function drawAxis(ctx, axis) {
        axis[sort_by].forEach(a => {
            let a_x = a.x * (window_width - (chart_margin.left + chart_margin.right));
            let a_width = a.width * (window_width - (chart_margin.left + chart_margin.right));
            ctx.save();
            ctx.strokeStyle = "#1400a3";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a_x, a.y);
            ctx.lineTo(a_x, chart_height - (chart_margin.top + chart_margin.bottom) + 5);
            ctx.moveTo(a_x + a_width, a.y);
            ctx.lineTo(a_x + a_width, chart_height - (chart_margin.top + chart_margin.bottom) + 5);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            ctx.fillStyle = "#1400a3";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(a.label, a_x + (a_width / 2), chart_height - (chart_margin.top + chart_margin.bottom) + 20);
        });
    };

    useEffect(()=> {
        if (!$canvas_bottom.current) return;
        setCtxBottom($canvas_bottom.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas_bottom.current) return;
        if (!ctx_bottom) return;
        transformCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data);
        drawAxis(ctx_bottom, data.axis);
    }, [ctx_bottom]);

    useEffect(()=>{
        if (!ctx_bottom) return;
        transformCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data);
        drawAxis(ctx_bottom, data.axis);
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
        transformCanvas(ctx_top);
        drawHighlight(ctx_top, highlight_id);
    }, [highlight_id]);


    return (
        <CanvasContainer>
            <CanvasBottom onMouseMove={onMouseMove} onMouseOut={onMouseOut} ref={$canvas_bottom} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
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


