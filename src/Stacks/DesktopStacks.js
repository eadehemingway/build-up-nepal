import React, { useState, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { StackedBar } from "./StackedBar";
import { getStackedData } from "./process_stacked_data";
import { SortDropdown } from "./SortDropdown";

export function DesktopStacks({ width, height, setHighlightLocked, highlight_id, setHighlightId, highlight_locked }) {
    const chart_height = (height - 40) / 3;
    const chart_margin = { left: 2, right: 220, top: 20, bottom: 40 };

    const [sort_by, setSortBy] = useState("year");
    const [window_width, setWindowWidth] = useState(document.body.clientWidth);
    const [stacked_data, setStackedData] = useState(null);

    useEffect(() => {
        setWindowWidth(document.body.clientWidth);
        const stack_data = getStackedData(chart_height, chart_margin);
        setStackedData(stack_data);
    }, []);

    return (
        <StackedBarContainer width={width} height={height}>
            <SortDropdown sort_by={sort_by} setSortBy={setSortBy}/>
            {stacked_data && stacked_data.map((d,i)=> (
                <StackedBar
                    key={i}
                    data={d}
                    highlight_id={highlight_id}
                    setHighlightId={setHighlightId}
                    chart_margin={chart_margin}
                    chart_height={chart_height}
                    window_width={window_width}
                    width={width}
                    sort_by={sort_by}
                    setHighlightLocked={setHighlightLocked}
                    highlight_locked={highlight_locked}
                />
            ))}
        </StackedBarContainer>
    );
}

const StackedBarContainer = styled.div`
    width: ${({ width }) => width }px;
    height: ${({ height }) => height }px;
    position: absolute;
    bottom: 0px;
    right: 0;
    vertical-align: top;
    line-height: 0px;
    background: #FFD6FF;
`;