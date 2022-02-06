import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export function StackedBar({
    width,
    is_mobile,
    setHighlightLocked,
    data,
    highlight_id,
    setHighlightId,
    chart_margin,
    window_width,
    chart_height,
    sort_by,
    highlight_locked,
    label_size
}) {

    const [ctx_bottom, setCtxBottom] = useState(null);
    const $canvas_bottom = useRef(null);

    const regular_stroke_width = 0.1;
    const highlight_stroke_width = 2;
    const bar_fill = "#fdc0ff";

    const red = "#ff0000";
    const blue = "#1400a3";
    const offset_left = window_width - width;
    const chart_width = width - (chart_margin.left + chart_margin.right);
    const bar_height = chart_height - (chart_margin.top + chart_margin.bottom);

    const getBarId =  useCallback((x) => {
        let filtered = data.data.filter(function(d) {
            let d_x = d.x[sort_by] * chart_width;
            let d_width = d.width[sort_by] * chart_width;
            return x >= d_x && x <= (d_x + d_width);
        });
        if (!filtered.length) return null;
        return filtered[0].id;
    }, [chart_width, data, sort_by]);

    const formatNumber = useCallback((number, to_fixed) => {
        const number_copy = number.valueOf().toString();
        let decimals = number_copy.split(".")[1] || [];
        if (decimals.length > 1) number = number.toFixed(to_fixed !== undefined ? to_fixed : 2);
        if (number > 1000) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number;
    }, []);

    const updateHighlight =(e)=>{
        let x = e.clientX - (chart_margin.left + offset_left);
        const ID = getBarId(x);
        if (ID == null) return;
        setHighlightId(ID);
    };
    const onMouseMove = useCallback((e) => {
        if(!highlight_locked){
            updateHighlight(e);
        }
    }, [chart_margin, setHighlightId, offset_left, getBarId, highlight_locked]);

    const onMouseOut = useCallback(() => {
        if (!highlight_locked){
            setHighlightId(null);
        }
    }, [setHighlightId, highlight_locked]);

    const onClick = useCallback((e) => {
        e.stopPropagation();
        updateHighlight(e);
        setHighlightLocked(true);
    }, [setHighlightLocked, setHighlightId, getBarId, chart_margin, offset_left]);

    const transformCanvas = useCallback((ctx) => {
        ctx.resetTransform();
        ctx.scale(2, 2);
        ctx.translate(chart_margin.left, chart_margin.top);
    }, [chart_margin]);

    const clearCanvas = useCallback((ctx) => {
        ctx.save();
        ctx.translate(-chart_margin.left, -chart_margin.top);
        ctx.clearRect(-(highlight_stroke_width), -(highlight_stroke_width), width + (highlight_stroke_width / 2), chart_height + (highlight_stroke_width / 2));
        ctx.restore();
    }, [chart_margin, highlight_stroke_width, width, chart_height]);

    const drawAxis = useCallback((ctx, axis) => {
        axis[sort_by].forEach((a) => {
            ctx.font = "13px code-saver, sans-serif";
            const label = sort_by === "metric" ? formatNumber(a.label) : a.label;
            const a_width = a.width * chart_width;
            const hide_label = ctx.measureText(label).width + 5 > a_width && a.align === "left";
            const a_x = a.x * chart_width;
            const offset = a.align === "left" ? 5 : -5;
            ctx.save();
            ctx.strokeStyle = blue;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a_x, a.y);
            ctx.lineTo(a_x, bar_height + 20);
            ctx.moveTo(a_x + a_width, a.y);
            ctx.lineTo(a_x + a_width, bar_height + 20);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            if (hide_label) return;
            ctx.textAlign = a.align;
            ctx.fillStyle = blue;
            ctx.fillText(label, a_x + offset, bar_height + 20);
        });
    },[chart_width, sort_by, formatNumber, bar_height]);

    const drawHighlight = useCallback((ctx, highlight_id) => {
        const highlight = data.data.find(d => d.id === highlight_id);
        if (!highlight) return;
        const x = highlight.x[sort_by] * chart_width;
        const y = highlight.y;
        const w = highlight.width[sort_by] * chart_width;
        const h = highlight.height;
        const suffix = highlight.value.metric === 1 ? data.suffix.singular : data.suffix.plural;
        ctx.save();
        const highlight_fill = highlight["flag-status"] === "enterprise" ? "red" : "blue";
        ctx.fillStyle = highlight_fill;
        const arrow_d = "l -3 -5.1962 h 6 l -3 5.1962";
        const path = new Path2D(`M ${x + (w / 2)} ${y} ${arrow_d} h ${w / 2} v ${h} h ${-w} v ${-h} Z`);
        ctx.fill(path);
        ctx.font = "13px code-saver, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(formatNumber(highlight.value.metric) + suffix, x + (w / 2), y - 10);
        ctx.restore();
    }, [data, sort_by, chart_width, formatNumber]);

    const drawStackedBar = useCallback((ctx, data) => {
        clearCanvas(ctx);
        data.data.forEach(v => {
            let x = v.x[sort_by] * chart_width;
            let bar_width = v.width[sort_by] * chart_width;
            ctx.save();
            ctx.fillStyle = v.filtered ? "pink" : bar_fill;
            ctx.strokeStyle = red;
            ctx.lineWidth = regular_stroke_width;
            ctx.fillRect(x, v.y, bar_width, v.height);
            ctx.strokeRect(x, v.y, bar_width, v.height);
            ctx.restore();
        });

        ctx.textAlign = "left";
        ctx.font = `${label_size}px code-saver, sans-serif`;
        const label = formatNumber(data.total, 0);
        const label_measures = ctx.measureText(label);
        const label_height = label_measures.fontBoundingBoxAscent - label_measures.fontBoundingBoxDescent;
        ctx.fillStyle = blue;
        ctx.fillText(label, chart_width + 10, bar_height - ((bar_height - label_height) / 2));
        ctx.font = "13px code-saver, sans-serif";
        ctx.fillText(is_mobile ? "Total" : data.caption, chart_width + 10, -10);

    }, [sort_by, chart_width, regular_stroke_width, bar_fill, clearCanvas, formatNumber, bar_height, is_mobile, label_size]);

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
        clearCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data);
        drawHighlight(ctx_bottom, highlight_id);
        drawAxis(ctx_bottom, data.axis);
    }, [data, highlight_id, sort_by]);

    return (
        <CanvasContainer>
            <CanvasChart onMouseMove={onMouseMove} onMouseOut={onMouseOut} onClick={onClick} ref={$canvas_bottom} width={width * 2} height={chart_height * 2} chart_height={chart_height}/>
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