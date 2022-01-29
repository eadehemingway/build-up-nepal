import React, { useState, useRef } from "react";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import { StackedBar } from "./StackedBar";

const window_width = document.body.clientWidth;
const chart_margin_left = 100;
const chart_margin_right = 200;
const chart_width = window_width - (chart_margin_left + chart_margin_right);
const chart_height = 80;

function checkMetric(str) {
    // if (/^\s*$/.test(str)) return 0;
    if (str === "" || str === " ") return 0;
    if (!isNaN(str)) return Number(str);
    return null;
}

function stackData(d) {
    let x = 0;
    let y = 0;
    let height = 50;
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
        let width = proportion * chart_width;
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

    const [carbon_highlight, setCarbonHighlight] = useState(null);
    const [houses_highlight, setHousesHighlight] = useState(null);
    const [jobs_highlight, setJobsHighlight] = useState(null);

    function updateCarbonData(changes) {
        let updated_data = [...carbon_data];
        if (changes.highlighted.length) {
            let index = updated_data.findIndex(e => e.id === changes.highlighted[0]);
            setCarbonHighlight(updated_data[index]);
        }
        if (changes.filtered.length) {
            setCarbonData(updated_data);
        }
    }

    function updateHousesData(changes) {
        let updated_data = [...houses_data];
        if (changes.highlighted.length) {
            let index = updated_data.findIndex(e => e.id === changes.highlighted[0]);
            setHousesHighlight(updated_data[index]);
        }
        if (changes.filtered.length) {
            setHousesData(updated_data);
        }
    }

    function updateJobsData(changes) {
        let updated_data = [...jobs_data];
        if (changes.highlighted.length) {
            let index = updated_data.findIndex(e => e.id === changes.highlighted[0]);
            setJobsHighlight(updated_data[index]);
        }
        if (changes.filtered.length) {
            setJobsData(updated_data);
        }
    }

    function updateData(changes) {
        updateCarbonData(changes);
        updateHousesData(changes);
        updateJobsData(changes);
    }

    return (
        <StackedBarContainer>
            <StackedBar data={carbon_data} highlight={carbon_highlight} updateData={updateData}/>
            <StackedBar data={houses_data} highlight={houses_highlight} updateData={updateData}/>
            <StackedBar data={jobs_data} highlight={jobs_highlight} updateData={updateData}/>
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