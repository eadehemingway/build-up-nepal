import React, { useState, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import { StackedBar } from "./StackedBar";
import { SortButtons } from "./SortButtons";

const chart_margin = { left: 100, right: 200, top: 20, bottom: 30 };
const chart_height = 80;

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

function stackData(d, w, sort) {
    let x = 0;
    let y = 0;
    let height = chart_height - (chart_margin.top + chart_margin.bottom);
    let stacked = [...d].map(v => ({
        year: v.year,
        metric: checkMetric(v.metric),
        id: v.id,
        province: v.province,

    })).filter(v => v.metric !== null);
    let metric_total = stacked.reduce((partialSum, a) => partialSum + Number(a.metric), 0);
    stacked.total = metric_total;
    stacked.axis = [];
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
        let relevant_axis = stacked.axis.filter(e => e.label === d[sort]);
        if (!relevant_axis.length) {
            stacked.axis.push({ label: d[sort], x: x, width: 0, y: 0 });
        } else {
            relevant_axis[0].width += width;
        }
        x += width;
    });
    return stacked;
}

function mapMetric(metric) {
    const mapped = data.map(d => ({
        metric: d[metric],
        year: d["Start Year"],
        id: d["id"],
        province: d["Province Project"]
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
        window.addEventListener("resize", () => {
            if (document.body && document.body.clientWidth) {
                setWindowWidth(document.body.clientWidth);
            }
        });
    }, []);

    useEffect(() => {
        setCarbonData(stackData(mapMetric("CO2 saved").sort((a, b) => sortAlphabetically(a.year, b.year)), window_width, "year"));
        setHousesData(stackData(mapMetric("Houses built TOTAL").sort((a, b) => sortAlphabetically(a.year, b.year)), window_width, "year"));
        setJobsData(stackData(mapMetric("Total jobs").sort((a, b) => sortAlphabetically(a.year, b.year)), window_width, "year"));
    }, [window_width]);

    function updateCarbonData(changes) {
        let updated_data = [...carbon_data];
        if (changes.sort) {
            updated_data.sort(function(a, b) {
                if (changes.sort === "size") {
                    return sortNumerically(a[changes.sort], b[changes.sort]);
                } else {
                    return sortAlphabetically(a[changes.sort], b[changes.sort]);
                }
            });
            setCarbonData(stackData(updated_data, window_width, changes.sort));
        }
        // if (changes.filtered.length) { setCarbonData(updated_data); };
        if (changes.highlighted == null) {
            setCarbonHighlight(null);
            return;
        }
        let index = updated_data.findIndex(e => e.id === changes.highlighted);
        setCarbonHighlight(updated_data[index]);
    }

    function updateHousesData(changes) {
        let updated_data = [...houses_data];
        if (changes.sort) {
            updated_data.sort(function(a, b) {
                if (changes.sort === "size") {
                    return sortNumerically(a[changes.sort], b[changes.sort]);
                } else {
                    return sortAlphabetically(a[changes.sort], b[changes.sort]);
                }
            });
            setHousesData(stackData(updated_data, window_width, changes.sort));
        }
        // if (changes.filtered.length) setHousesData(updated_data);
        if (changes.highlighted == null) {
            setHousesHighlight(null);
            return;
        }
        let index = updated_data.findIndex(e => e.id === changes.highlighted);
        setHousesHighlight(updated_data[index]);
    }

    function updateJobsData(changes) {
        let updated_data = [...jobs_data];
        if (changes.sort) {
            updated_data.sort(function(a, b) {
                if (changes.sort === "size") {
                    return sortNumerically(a[changes.sort], b[changes.sort]);
                } else {
                    return sortAlphabetically(a[changes.sort], b[changes.sort]);
                }
            });
            setJobsData(stackData(updated_data, window_width, changes.sort));
        }
        // if (changes.filtered.length) setJobsData(updated_data);
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
            <SortButtons updateData={updateData}/>
            <StackedBar data={carbon_data} highlight={carbon_highlight} updateData={updateData} chart_margin={chart_margin} window_width={window_width} chart_height={chart_height}/>
            <StackedBar data={houses_data} highlight={houses_highlight} updateData={updateData} chart_margin={chart_margin} window_width={window_width} chart_height={chart_height}/>
            <StackedBar data={jobs_data} highlight={jobs_highlight} updateData={updateData} chart_margin={chart_margin} window_width={window_width} chart_height={chart_height}/>
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
    background: white;
`;