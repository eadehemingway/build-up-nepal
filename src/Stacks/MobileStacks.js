import React, { useState, useRef, useMemo } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { StackedBar } from "./StackedBar";
import { getStackedData } from "./process_stacked_data";
import { SortDropdown } from "./SortDropdown";
import { Dropdown } from "./../shared/Dropdown";

export function MobileStacks({ width, height, setHighlightLocked, highlight_id, setHighlightId, highlight_locked }) {
    const chart_height = (height - 40) / 3;
    const chart_margin = { left: 2, right: 220, top: 20, bottom: 40 };

    const [sort_by, setSortBy] = useState("year");
    const [window_width, setWindowWidth] = useState(document.body.clientWidth);
    const [stacked_data, setStackedData] = useState(null);
    const [selected_metric, setSelectedMetric] = useState(null);
    const options = [
        { label: "Total jobs created", value: "Total jobs created" },
        { label: "Total CO₂ saved", value: "Total CO₂ saved" },
        { label: "Total houses built", value: "Total houses built" }
    ];
    useEffect(() => {
        setWindowWidth(document.body.clientWidth);
        const stack_data = getStackedData(chart_height, chart_margin);
        setStackedData(stack_data);
        setSelectedMetric(options[0].value);
    }, []);

    const selected_stacked_data = useMemo(()=>{
        const d = stacked_data?.find(d=> d.caption === selected_metric);
        return d;
    }, [selected_metric, stacked_data]);
    return (
        <StackedBarContainer width={width} height={height}>
            <Dropdowns>
                <SortDropdown sort_by={sort_by} setSortBy={setSortBy}/>
                <Dropdown
                    label={"View metric:"}
                    value={selected_metric}
                    options={options}
                    onSelect={setSelectedMetric}
                />
            </Dropdowns>
            {selected_stacked_data &&  <StackedBar
                data={selected_stacked_data}
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                chart_margin={chart_margin}
                chart_height={chart_height}
                window_width={window_width}
                width={width}
                sort_by={sort_by}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
            />}

        </StackedBarContainer>
    );
}

const StackedBarContainer = styled.div`
    height: ${({ height }) => height }px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right:20px;
    vertical-align: top;
    line-height: 0px;
    background: #FFD6FF;
    border: 1px solid red;
`;

const Dropdowns = styled.div`
display: flex;
flex-direction: column;

`;