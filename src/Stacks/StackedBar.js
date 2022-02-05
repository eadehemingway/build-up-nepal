import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export function StackedBar({ setTextBoxOpen, data, highlight_id, setHighlightId, chart_margin, window_width, chart_height, sort_by }) {

    const [ctx_bottom, setCtxBottom] = useState(null);
    const $canvas_bottom = useRef(null);

    const regular_stroke_width = 0.1;
    const highlight_stroke_width = 2;
    const bar_fill = "#fdc0ff";
    const bar_stroke = "#ff0000";
    const highlight_fill = "#ff0000";
    const highlight_stroke = "#ff0000";

    const getBarId =  useCallback((x) => {
        let filtered = data.data.filter(function(d) {
            let d_x = d.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            let d_width = d.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            return x >= d_x && x <= (d_x + d_width);
        });
        if (!filtered.length) return null;
        return filtered[0].id;
    }, [chart_margin, window_width, data, sort_by]);

    const formatNumber = useCallback((number, to_fixed) => {
        const number_copy = number.valueOf().toString();
        let decimals = number_copy.split(".")[1] || [];
        if (decimals.length > 1) number = number.toFixed(to_fixed !== undefined ? to_fixed : 2);
        if (number > 1000) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number;
    }, []);

    const onMouseMove = useCallback((e) => {
        let x = e.clientX - chart_margin.left;
        const ID = getBarId(x);
        if (ID == null) return;
        setHighlightId(ID);
    }, [chart_margin, setHighlightId, getBarId]);

    const onMouseOut = useCallback(() => {
        setHighlightId(null);
    }, [setHighlightId]);

    const onClick = useCallback(() => {
        setTextBoxOpen(true);
    }, []);

    const transformCanvas = useCallback((ctx) => {
        ctx.resetTransform();
        ctx.scale(2, 2);
        ctx.translate(chart_margin.left, chart_margin.top);
    }, [chart_margin]);

    const clearCanvas = useCallback((ctx) => {
        ctx.save();
        ctx.translate(-chart_margin.left, -chart_margin.top);
        ctx.clearRect(-(highlight_stroke_width), -(highlight_stroke_width), window_width + (highlight_stroke_width / 2), chart_height + (highlight_stroke_width / 2));
        ctx.restore();
    }, [chart_margin, highlight_stroke_width, window_width, chart_height]);

    const drawAxis = useCallback((ctx, axis) => {
        axis[sort_by].forEach((a) => {
            ctx.font = "13px code-saver, sans-serif";
            const label = sort_by === "metric" ? formatNumber(a.label) : a.label;
            const a_width = a.width * (window_width - (chart_margin.left + chart_margin.right));
            const hide_label = ctx.measureText(label).width + 5 > a_width && a.align === "left";
            const a_x = a.x * (window_width - (chart_margin.left + chart_margin.right));
            const offset = a.align === "left" ? 5 : -5;
            ctx.save();
            ctx.strokeStyle = "#1400a3";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a_x, a.y);
            ctx.lineTo(a_x, chart_height - (chart_margin.top + chart_margin.bottom) + 20);
            ctx.moveTo(a_x + a_width, a.y);
            ctx.lineTo(a_x + a_width, chart_height - (chart_margin.top + chart_margin.bottom) + 20);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            if (hide_label) return;
            ctx.textAlign = a.align;
            ctx.fillText(label, a_x + offset, chart_height - (chart_margin.top + chart_margin.bottom) + 20);
            ctx.fillStyle = "#1400a3";
        });
    },[chart_margin, chart_height, window_width, sort_by, formatNumber]);

    const drawHighlight = useCallback((ctx, highlight_id) => {
        const highlight = data.data.find(d => d.id === highlight_id);
        if (!highlight) return;
        const x = highlight.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
        const y = highlight.y;
        const w = highlight.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
        const h = highlight.height;
        const suffix = highlight.value.metric === 1 ? data.suffix.singular : data.suffix.plural;
        ctx.save();
        ctx.fillStyle = highlight_stroke;
        const arrow_d = "l -3 -5.1962 h 6 l -3 5.1962";
        const path = new Path2D(`M ${x + (w / 2)} ${y} ${arrow_d} h ${w / 2} v ${h} h ${-w} v ${-h} Z`);
        ctx.fill(path);
        ctx.font = "13px code-saver, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(formatNumber(highlight.value.metric) + suffix, x + (w / 2), y - 10);
        ctx.restore();
    }, [chart_margin, data, sort_by, highlight_stroke, window_width, formatNumber]);

    const drawStackedBar = useCallback((ctx, data) => {
        clearCanvas(ctx);
        data.forEach(v => {
            let x = v.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            let width = v.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
            ctx.save();
            ctx.fillStyle = v.filtered ? "pink" : bar_fill;
            ctx.strokeStyle = bar_stroke;
            ctx.lineWidth = regular_stroke_width;
            ctx.fillRect(x, v.y, width, v.height);
            ctx.strokeRect(x, v.y, width, v.height);
            ctx.restore();
        });
    }, [sort_by, chart_margin, window_width, regular_stroke_width, bar_stroke, bar_fill, clearCanvas]);

    useEffect(()=> {
        if (!$canvas_bottom.current) return;
        setCtxBottom($canvas_bottom.current.getContext("2d"));
    }, []);

    useEffect(()=>{
        if (!$canvas_bottom.current) return;
        if (!ctx_bottom) return;
        transformCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data.data);
        drawAxis(ctx_bottom, data.axis);
    }, [ctx_bottom]);

    useEffect(()=>{
        if (!ctx_bottom) return;
        clearCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data.data);
        drawHighlight(ctx_bottom, highlight_id);
        drawAxis(ctx_bottom, data.axis);
    }, [data, highlight_id]);

    return (
        <CanvasContainer>
            <CanvasChart onMouseMove={onMouseMove} onMouseOut={onMouseOut} onClick={onClick} ref={$canvas_bottom} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
        </CanvasContainer>
    );
}

const CanvasContainer = styled.div`
    width: 100%;
    display: inline-block;
    margin: 0px;
    padding: 0px;
    position: relative;
    cursor: pointer;
`;

const CanvasChart = styled.canvas`
    width: 100%;
    height: ${({ chart_height })=>chart_height}px;
    display: inline-block;
    margin: 0px;
    padding: 0px;
    z-index: 5;
`;