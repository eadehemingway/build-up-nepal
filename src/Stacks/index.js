import React, { useState, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { data } from "../data/data";
import { StackedBar } from "./StackedBar";
import { SortButtons } from "./SortButtons";

export function StackedBars({ highlight_id, setHighlightId }) {

    const chart_margin = { left: 50, right: 220, top: 30, bottom: 40 };
    const chart_height = 100;
    const [sort_by, setSortBy] = useState("year");
    const [window_width, setWindowWidth] = useState(document.body.clientWidth);

    useEffect(() => {
        setWindowWidth(document.body.clientWidth);
    }, []);

    function checkMetric(str) {
        if (str === "" || str === " ") return 0;
        if (!isNaN(str)) return Number(str);
        return null;
    }

    function sortAlphabetically(a, b) {
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    }

    function sortNumerically(a, b) {
        return a - b;
    }

    function checkValues(values) {
        for (var value in values) {
            if (values[value] == null) return false;
        }
        return true;
    }

    function stack(metric, sortings) {
        let height = chart_height - (chart_margin.top + chart_margin.bottom);
        let stacked = {};
        stacked.data = [...data].map(d => {
            let values = {};
            for (var sorting in sortings) {
                values[sorting] = sorting === "metric" ? checkMetric(d[sortings[sorting]]) : d[sortings[sorting]];
            }
            if (!checkValues(values)) return;
            let mapped = {
                value: values,
                id: d.id,
                height: height,
                x: {},
                width: {},
                y: 0
            };
            return mapped;
        });
        let metric_total = stacked.data.reduce((partialSum, a) => partialSum + Number(a["value"]["metric"]), 0);
        let axis = {};
        stacked.total = metric_total;
        stacked.name = metric.name;
        stacked.suffix = metric.suffix;
        stacked.caption = metric.caption;

        for (var sorting in sortings) {
            let x = 0;
            axis[sorting] = [];
            stacked.data.sort(function(a, b) {
                let sortBy = sorting;
                if (sortBy === "metric") return sortNumerically(a.value[sortBy], b.value[sortBy]);
                else return sortAlphabetically(a.value[sortBy], b.value[sortBy]);
            });
            stacked.data.forEach(function(d) {
                let val = d.value["metric"];
                let proportion = val / metric_total; // As a decimal
                d.x[sorting] = x;
                d.width[sorting] = proportion;

                // Update axis
                let relevant_axis = axis[sorting].filter(e => e.label === d.value[sorting]);
                if (!relevant_axis.length) axis[sorting].push({ label: d.value[sorting], x: x, width: proportion, y: 0 });
                else relevant_axis[0].width += proportion;

                x += proportion;
            });
            stacked.axis = axis;
        }
        return stacked;
    }

    function mapData(chosen_metrics, chosen_sortings) {
        let mapped_metrics = [...chosen_metrics];

        let mapped_data = mapped_metrics.map(metric => {
            chosen_sortings["metric"] = metric.name;
            return stack(metric, chosen_sortings);
        });

        return mapped_data;
    }

    const chosen_metrics = [{
        name: "CO2 saved",
        caption: "Total CO₂ saved",
        suffix: { singular: "t", plural: "t" },
    },{
        name: "Houses built TOTAL",
        caption: "Total houses built",
        suffix: { singular: " house", plural: " houses" },
    },{
        name: "Total jobs",
        caption: "Total jobs created",
        suffix: { singular: " job", plural: " jobs" },
    }];

    const chosen_sortings = { year: "Start Year", province: "Province Project" };
    const data_arr = mapData(chosen_metrics, chosen_sortings);

    return (
        <StackedBarContainer>
            <SortButtons sort_by={sort_by} setSortBy={setSortBy}/>
            {data_arr.map((d,i)=> (
                <StackedBar
                    key={i}
                    data={d}
                    highlight_id={highlight_id}
                    setHighlightId={setHighlightId}
                    chart_margin={chart_margin}
                    chart_height={chart_height}
                    window_width={window_width}
                    sort_by={sort_by}
                />
            ))}
        </StackedBarContainer>
    );
}

const StackedBarContainer = styled.div`
    width: 100%;
    position: absolute;
    bottom: 0px;
    left: 0;
    vertical-align: top;
    line-height: 0px;
    background: #FFD6FF;
`;