import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export function TotalSvg({ caption, suffix, total, chart_margin, chart_height, window_width, formatNumber }) {

    let chart_width = window_width - (chart_margin.left + chart_margin.right);

    return (
        <TotalLabelContainer label_width={chart_margin.right} margin_left={chart_margin.left} label_height={chart_height} chart_width={chart_width}>
            <CaptionText y={chart_margin.top - 10}>{caption}</CaptionText>
            <TotalText y={chart_margin.top + (chart_height - (chart_margin.top + chart_margin.bottom))}>
                {formatNumber(total, 0)}{total === 1 ? suffix.singular : suffix.plural}
            </TotalText>
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


