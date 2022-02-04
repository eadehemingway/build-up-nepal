import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TotalSvg } from "./TotalSvg";

export function StackedBar({ data, highlight_id, setHighlightId, chart_margin, window_width, chart_height, sort_by }) {

    const [ctx_bottom, setCtxBottom] = useState(null);
    const $svg_top = useRef(null);

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

    const regular_stroke_width = 0.1;
    const highlight_stroke_width = 2;
    const bar_fill = "#fdc0ff";
    const bar_stroke = "#ff0000";
    const highlight_fill = "#ff0000";
    const highlight_stroke = "#ff0000";

    function formatNumber(number, to_fixed) {
        const number_copy = number.valueOf().toString();
        let decimals = number_copy.split(".")[1] || [];
        if (decimals.length > 1) number = number.toFixed(to_fixed !== undefined ? to_fixed : 2);
        if (number > 1000) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number;
    }

    function onMouseMove(e) {
        let x = e.clientX - chart_margin.left;
        const ID = getBarId(x);
        if (ID == null) return;
        setHighlightId(ID);
    }

    function onMouseOut() {
        setHighlightId(null);
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

    function drawHighlight(svg, highlight_id) {
        const highlight = data.data.find(d => d.id === highlight_id);
        svg.innerHTML = "";
        if (!highlight) return;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const highlight_x = chart_margin.left + (highlight.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right)));
        const highlight_y = chart_margin.top;
        const highlight_width = highlight.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
        const suffix = highlight.value.metric === 1 ? data.suffix.singular : data.suffix.plural;
        const arrow_d = "l -3 -5.1962 h 6 l -3 5.1962";
        const path_d = `M ${highlight_x + (highlight_width / 2)} ${highlight_y} ${arrow_d} h ${highlight_width / 2} v ${highlight.height} h ${-highlight_width} v ${-highlight.height} Z`;
        path.setAttribute("d", path_d);
        path.setAttribute("fill", highlight_stroke);
        svg.appendChild(path);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "13px");
        text.setAttribute("fill", highlight_stroke);
        text.setAttribute("x", (highlight_x + (highlight_width / 2)));
        text.setAttribute("y", highlight_y - 10);
        text.innerHTML = formatNumber(highlight.value.metric) + suffix;
        svg.appendChild(text);
    }

    function drawStackedBar(ctx, d) {
        clearCanvas(ctx);
        d.data.forEach(v => {
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

        // ctx.textAlign = "left";
        // ctx.font = "38px sans-serif";
        // ctx.fillStyle = "red";
        // ctx.fillText(d.total, (window_width - (chart_margin.left + chart_margin.right)) + 10, chart_height - (chart_margin.top + chart_margin.bottom));
        // ctx.fillStyle = "#1400a3";
        // ctx.font = "12px sans-serif";
        // ctx.fillText(d.name, (window_width - (chart_margin.left + chart_margin.right)) + 10, -8);
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
    }, [ctx_bottom]);

    useEffect(()=>{
        if (!ctx_bottom) return;
        transformCanvas(ctx_bottom);
        drawStackedBar(ctx_bottom, data);
    }, [data]);


    useEffect(()=>{
        if (!$svg_top) return;
        // transformCanvas(svg_top);
        $svg_top.current.innerHTML = "";
        drawHighlight($svg_top.current, highlight_id);
        // drawAxis(ctx_bottom, data.axis);
    }, [highlight_id]);


    return (
        <CanvasContainer>
            <CanvasBottom onMouseMove={onMouseMove} onMouseOut={onMouseOut} ref={$canvas_bottom} width={window_width * 2} height={chart_height * 2} chart_height={chart_height}/>
            <SvgTop ref={$svg_top} width={window_width} height={chart_height} chart_height={chart_height}/>
            <TotalSvg formatNumber={formatNumber} caption={data.caption} suffix={data.suffix} total={data.total} chart_margin={chart_margin} chart_height={chart_height} window_width={window_width}/>
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

const SvgTop = styled.svg`
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 2;
    pointer-events: none;
`;


