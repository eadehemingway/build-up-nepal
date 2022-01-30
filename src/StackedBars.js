import React, { useState, useRef } from "react";
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
        d.highlighted = false;
        d.filtered = false;
        x += width;
    });
    return stacked;
}


export function StackedBars() {

    const [carbon_data, setCarbonData] = useState(stackData(data.map(d => ({
        metric: d["CO2 saved"],
        year: d["Start Year"],
        id: d["id"]
    }))));
    const [houses_data, setHousesData] = useState(stackData(data.map(d => ({
        metric: d["Houses built TOTAL"],
        year: d["Start Year"],
        id: d["id"]
    }))));;
    const [jobs_data, setJobsData] = useState(stackData(data.map(d => ({
        metric: d["Total jobs"],
        year: d["Start Year"],
        id: d["id"]
    }))));

    const [highlight_id, setHighlightId] = useState(null);


    function updateBarData(data, setData, changes){
        let updated_data = [...data];
        if (changes.highlighted.length) {
            let index = updated_data.findIndex(e => e.id === changes.highlighted[0]);
            setHighlightId(updated_data[index].id);
        }
        if (changes.filtered.length) {
            setData(updated_data);
        }

    }

    function updateData(changes) {
        if (changes.highlighted == null) {
            setHighlightId(null);
            return;
        }
        updateBarData(carbon_data, setCarbonData, changes);
        updateBarData(houses_data, setHousesData, changes);
        updateBarData(jobs_data, setJobsData, changes);

    }

    return (
        <StackedBarContainer>
            <StackedBar data={carbon_data} highlight_id={highlight_id} updateData={updateData} chart_margin={chart_margin} chart_size={chart_size} bar_size={bar_size}/>
            <StackedBar data={houses_data} highlight_id={highlight_id} updateData={updateData} chart_margin={chart_margin} chart_size={chart_size} bar_size={bar_size}/>
            <StackedBar data={jobs_data} highlight_id={highlight_id} updateData={updateData} chart_margin={chart_margin} chart_size={chart_size} bar_size={bar_size}/>
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