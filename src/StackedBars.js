import React, { useState, useRef, useMemo } from "react";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import { StackedBar } from "./StackedBar";

const window_width = document.body.clientWidth;
const chart_margin = {
    left: 100,
    right: 200,
    top: 20,
    bottom: 20
};
const chart_size = {
    width: window_width,
    height: 80
};
const bar_size = {
    width: window_width - (chart_margin.left + chart_margin.right),
    height: chart_size.height - (chart_margin.top + chart_margin.bottom)
};

function checkMetric(str) {
    // if (/^\s*$/.test(str)) return 0;
    if (str === "" || str === " ") return 0;
    if (!isNaN(str)) return Number(str);
    return null;
}

function stackData(d) {
    let x = 0;
    let y = 0;
    let height = bar_size.height;
    let stacked = [...d].map(v => ({
        year: v.year,
        metric: checkMetric(v.metric),
        id: v.id,

    })).filter(v => v.metric !== null);
    let metric_total = stacked.reduce((partialSum, a) => partialSum + Number(a.metric), 0);
    stacked.total = metric_total;
    stacked.forEach(function(d, i) {
        let val = d.metric;
        let proportion = val / metric_total; // As a decimal
        let width = proportion * bar_size.width;
        d.x = x;
        d.y = y;
        d.height = height;
        d.width = width;
        // d.highlighted = false;
        d.filtered = false;
        x += width;
    });
    return stacked;
}


export function StackedBars({ locked_highlight_id, setLockedHighlightId }) {
    const [highlight_id, setHighlightId] = useState(null);
    const carbon_data = useMemo(()=>{
        return stackData(data.map(d => ({
            metric: d["CO2 saved"],
            year: d["Start Year"],
            id: d["id"]
        })));
    }, []);
    const houses_data = useMemo(()=>{
        return stackData(data.map(d => ({
            metric: d["Houses built TOTAL"],
            year: d["Start Year"],
            id: d["id"]
        })));
    }, []);
    const jobs_data = useMemo(()=>{
        return stackData(data.map(d => ({
            metric: d["Total jobs"],
            year: d["Start Year"],
            id: d["id"]
        })));
    }, []);


    const data_arr = [carbon_data, houses_data, jobs_data];
    return (
        <StackedBarContainer>
            {data_arr.map((d,i)=> (
                <StackedBar
                    key={i}
                    locked_highlight_id={locked_highlight_id}
                    setLockedHighlightId={setLockedHighlightId}
                    data={d}
                    highlight_id={highlight_id}
                    setHighlightId={setHighlightId}
                    chart_margin={chart_margin}
                    chart_size={chart_size}
                    bar_size={bar_size}/>
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
`;