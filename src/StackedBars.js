import React, { useState, useRef } from "react";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import { StackedBar } from "./StackedBar";

const window_width = document.body.clientWidth;

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
        let width = proportion * window_width;
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

    function updateCarbonData(changes) {
        let updated_data = [...carbon_data].map(function(d) { return ({ ...d, highlighted: false }); });
        if (changes.highlight.length) {
            changes.highlight.forEach(c => {
                updated_data[c].highlighted = true;
            });
        }
        // console.log("updated_data:", updated_data);
        setCarbonData(updated_data);
    }

    function updateHousesData(changes) {
    }

    function updateJobsData(changes) {
    }

    return (
        <StackedBarContainer>
            <StackedBar data={carbon_data} updateData={updateCarbonData}/>
            {/* <StackedBar data={houses_data} updateData={updateHousesData}/>
            <StackedBar data={jobs_data} updateData={updateJobsData}/> */}
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