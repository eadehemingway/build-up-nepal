import React, { useState, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import { StackedBar } from "./StackedBar";

const chart_margin = { left: 100, right: 200, top: 20, bottom: 20 };
const chart_height = 80;

function checkMetric(str) {
    // if (/^\s*$/.test(str)) return 0;
    if (str === "" || str === " ") return 0;
    if (!isNaN(str)) return Number(str);
    return null;
}

function stackData(d, w) {
    let x = 0;
    let y = 0;
    let height = chart_height - (chart_margin.top + chart_margin.bottom);
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
        let width = proportion * (w - (chart_margin.left + chart_margin.right));
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

function mapMetric(metric) {
    const mapped = data.map(d => ({
        metric: d[metric],
        year: d["Start Year"],
        id: d["id"]
    }));
    return mapped;
}


export function StackedBars() {

    const [window_width, setWindowWidth] = useState(document.body.clientWidth);

    const [carbon_data, setCarbonData] = useState([]);
    const [houses_data, setHousesData] = useState([]);
    const [jobs_data, setJobsData] = useState([]);

    const [carbon_highlight, setCarbonHighlight] = useState(null);
    const [houses_highlight, setHousesHighlight] = useState(null);
    const [jobs_highlight, setJobsHighlight] = useState(null);

    useEffect(() => {
        window.addEventListener("resize", ()=> {
            setWindowWidth(document.body.clientWidth);
        });
    }, []);
    useEffect(() => {
        setCarbonData(stackData(mapMetric("CO2 saved"), window_width));
        setHousesData(stackData(mapMetric("Houses built TOTAL"), window_width));
        setJobsData(stackData(mapMetric("Total jobs"), window_width));
    }, [window_width]);

    function updateCarbonData(changes) {
        let updated_data = [...carbon_data];
        if (changes.filtered.length) { setCarbonData(updated_data); };
        if (changes.highlighted == null) {
            setCarbonHighlight(null);
            return;
        }
        let index = updated_data.findIndex(e => e.id === changes.highlighted);
        setCarbonHighlight(updated_data[index]);
    }

    function updateHousesData(changes) {
        let updated_data = [...houses_data];
        if (changes.filtered.length) setHousesData(updated_data);
        if (changes.highlighted == null) {
            setHousesHighlight(null);
            return;
        }
        let index = updated_data.findIndex(e => e.id === changes.highlighted);
        setHousesHighlight(updated_data[index]);
    }

    function updateJobsData(changes) {
        let updated_data = [...jobs_data];
        if (changes.filtered.length) setJobsData(updated_data);
        if (changes.highlighted == null) {
            setJobsHighlight(null);
            return;
        }
        let index = updated_data.findIndex(e => e.id === changes.highlighted);
        setJobsHighlight(updated_data[index]);
    }

    function updateData(changes) {
        updateCarbonData(changes);
        updateHousesData(changes);
        updateJobsData(changes);
    }

    return (
        <StackedBarContainer>
            <StackedBar data={carbon_data} highlight={carbon_highlight} updateData={updateData} chart_margin={chart_margin} window_width={window_width}/>
            <StackedBar data={houses_data} highlight={houses_highlight} updateData={updateData} chart_margin={chart_margin} window_width={window_width}/>
            <StackedBar data={jobs_data} highlight={jobs_highlight} updateData={updateData} chart_margin={chart_margin} window_width={window_width}/>
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