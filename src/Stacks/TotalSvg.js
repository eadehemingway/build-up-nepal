import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export function TotalSvg({ total, chart_margin, chart_height, window_width }) {

    let chart_width = window_width - (chart_margin.left + chart_margin.right);

    // function drawHighlight(ctx, highlight_id) {
    //     const highlight = data.data.find(d => d.id === highlight_id);
    //     clearCanvas(ctx);
    //     if (!highlight) return;
    //     let highlight_x = highlight.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
    //     let highlight_width = highlight.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
    //     ctx.save();
    //     ctx.beginPath();
    //     ctx.fillStyle = highlight_stroke;
    //     ctx.rect(highlight_x, highlight.y, highlight_width, highlight.height);
    //     ctx.closePath();
    //     ctx.fill();
    //     ctx.font = "12px sans-serif";
    //     ctx.textAlign = "center";
    //     ctx.fillText(highlight.value.metric, (highlight_x + (highlight_width / 2)), highlight.y - 8);
    //     ctx.restore();
    // }

    // function drawStackedBar(ctx, d) {
    //     clearCanvas(ctx);
    //     d.data.forEach(v => {
    //         let x = v.x[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
    //         let width = v.width[sort_by] * (window_width - (chart_margin.left + chart_margin.right));
    //         ctx.save();
    //         ctx.fillStyle = v.filtered ? "pink" : bar_fill;
    //         ctx.strokeStyle = bar_stroke;
    //         ctx.lineWidth = regular_stroke_width;
    //         ctx.fillRect(x, v.y, width, v.height);
    //         ctx.strokeRect(x, v.y, width, v.height);
    //         ctx.restore();
    //     });

    //     ctx.textAlign = "left";
    //     ctx.font = "38px sans-serif";
    //     ctx.fillStyle = "red";
    //     ctx.fillText(d.total, (window_width - (chart_margin.left + chart_margin.right)) + 10, chart_height - (chart_margin.top + chart_margin.bottom));
    //     ctx.fillStyle = "#1400a3";
    //     ctx.font = "12px sans-serif";
    //     ctx.fillText(d.name, (window_width - (chart_margin.left + chart_margin.right)) + 10, -8);
    // }

    // function drawAxis(ctx, axis) {
    //     axis[sort_by].forEach(a => {
    //         let a_x = a.x * (window_width - (chart_margin.left + chart_margin.right));
    //         let a_width = a.width * (window_width - (chart_margin.left + chart_margin.right));
    //         ctx.save();
    //         ctx.strokeStyle = "#1400a3";
    //         ctx.lineWidth = 0.5;
    //         ctx.beginPath();
    //         ctx.moveTo(a_x, a.y);
    //         ctx.lineTo(a_x, chart_height - (chart_margin.top + chart_margin.bottom) + 5);
    //         ctx.moveTo(a_x + a_width, a.y);
    //         ctx.lineTo(a_x + a_width, chart_height - (chart_margin.top + chart_margin.bottom) + 5);
    //         ctx.closePath();
    //         ctx.stroke();
    //         ctx.restore();
    //         ctx.fillStyle = "#1400a3";
    //         ctx.font = "12px sans-serif";
    //         ctx.textAlign = "center";
    //         ctx.fillText(a.label, a_x + (a_width / 2), chart_height - (chart_margin.top + chart_margin.bottom) + 20);
    //     });
    // };

    // useEffect(()=>{
    //     if (!ctx_top) return;
    //     transformCanvas(ctx_top);
    //     drawHighlight(ctx_top, highlight_id);
    // }, [highlight_id]);


    return (
        <TotalLabelContainer label_width={chart_margin.right} margin_left={chart_margin.left} label_height={chart_height} chart_width={chart_width}>
            <CaptionText y={chart_margin.top - 10}>Caption</CaptionText>
            <TotalText y={chart_margin.top + (chart_height - (chart_margin.top + chart_margin.bottom))}>{total}</TotalText>
        </TotalLabelContainer>
    );
}

const TotalLabelContainer = styled.svg`
    width: ${({ label_width }) => label_width - 10}px;
    position: absolute;
    margin: 0px 0px 0px ${({ margin_left }) => margin_left}px;
    height: ${({ label_height }) => label_height}px;
    padding: 0px;
    top: 0px;
    left: ${({ chart_width }) => chart_width}px;
    pointer-events: none;
    z-index: 2;
    padding: 0px 0px 0px ${10}px;
`;

const CaptionText = styled.text`
    font-size: 12px;
    line-height: 12px;
    fill: #1400a3;
`;

const TotalText = styled.text`
    font-size: 38px;
    font-family: etna, serif;
    fill: #ff0000;
`;


