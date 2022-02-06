import React, { useState, useRef, useMemo } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { StackedBar } from "./StackedBar";
import { getStackedData } from "./process_stacked_data";
import { SortDropdown } from "./SortDropdown";
import { Dropdown } from "./../shared/Dropdown";
import { base_pink } from "../shared/colors";

export function MobileStacks({ margin, width, height, setHighlightLocked, highlight_id, setHighlightId, highlight_locked }) {
    const chart_height = (height - (49 * 2));
    const chart_margin = { left: 20, right: 100, top: 40, bottom: 25 };

    const [sort_by, setSortBy] = useState("year");
    const [window_width, setWindowWidth] = useState(document.body.clientWidth);
    const [stacked_data, setStackedData] = useState(null);
    const [selected_metric, setSelectedMetric] = useState(null);
    const options = [
        { label: "Jobs created", value: "Total jobs created" },
        { label: "CO₂ saved (tonnes)", value: "Total CO₂ saved (tonnes)" },
        { label: "Houses built", value: "Total houses built" }
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
                <SortDropdown
                    sort_by={sort_by}
                    setSortBy={setSortBy}
                    is_mobile={true}
                    margin={margin}
                />
                <Dropdown
                    label={"View metric"}
                    value={selected_metric}
                    options={options}
                    onSelect={setSelectedMetric}
                    is_mobile={true}
                    options_width={200}
                    margin={margin}
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
                label_size = {22}
                is_mobile={true}
            />}

        </StackedBarContainer>
    );
}

const StackedBarContainer = styled.div`
    height: ${({ height }) => height }px;
    position: absolute;
    bottom: 50px;
    vertical-align: top;
    line-height: 0px;
    background: ${base_pink};
`;

const Dropdowns = styled.div`
display: flex;
flex-direction: column;

`;