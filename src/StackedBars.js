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


export function StackedBars({ highlight_id, setHighlightId }) {

    const [window_width, setWindowWidth] = useState(document.body.clientWidth);

    const [carbon_data, setCarbonData] = useState([]);
    const [houses_data, setHousesData] = useState([]);
    const [jobs_data, setJobsData] = useState([]);


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

    function updateBarData(d, changes, setData){
        let updated_data = [...d];
        if (changes.sort) {
            updated_data.sort(function(a, b) {
                if (changes.sort === "size") {
                    return sortNumerically(a[changes.sort], b[changes.sort]);
                } else {
                    return sortAlphabetically(a[changes.sort], b[changes.sort]);
                }
            });
            setData(stackData(updated_data, window_width, changes.sort));
        }

    }



    function updateData(changes) {
        updateBarData(carbon_data, changes, setCarbonData);
        updateBarData(jobs_data, changes, setJobsData);
        updateBarData(houses_data, changes, setHousesData);
    }
    const data_arr = [carbon_data, houses_data, jobs_data];
    return (
        <StackedBarContainer>
            <SortButtons updateData={updateData}/>

            {data_arr.map((d,i)=> (
                <StackedBar
                    key={i}
                    data={d}
                    highlight_id={highlight_id}
                    setHighlightId={setHighlightId}
                    chart_margin={chart_margin}
                    updateData={updateData}
                    chart_height={chart_height}
                    window_width={window_width}
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
    background: white;
`;