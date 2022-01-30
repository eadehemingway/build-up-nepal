import React, { useState, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { data } from "./data/data";
import { StackedBar } from "./StackedBar";
import { SortButtons } from "./SortButtons";

export function StackedBars({ highlight_id, setHighlightId }) {

    const chart_margin = { left: 50, right: 200, top: 40, bottom: 30 };
    const chart_height = 100;
    const [sort_by, setSortBy] = useState("year");

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
        stacked.name = metric;

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

    function mapMetric(this_metric, all_metrics) {
        const mapped = data.map(d => ({
            metric: d[this_metric],
            year: d["Start Year"],
            id: d["id"],
            province: d["Province Project"]
        }));
        return mapped;
    }

    function mapData(chosen_metrics, chosen_sortings) {
        let mapped_metrics = [...chosen_metrics];

        let mapped_data = mapped_metrics.map(metric => {
            chosen_sortings["metric"] = metric;
            return stack(metric, chosen_sortings);
        });

        return mapped_data;
    }

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

    const chosen_metrics = ["CO2 saved", "Houses built TOTAL", "Total jobs"];
    const chosen_sortings = { year: "Start Year", province: "Province Project" };

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

    const data_arr = mapData(chosen_metrics, chosen_sortings);

    return (
        <StackedBarContainer>
            <SortButtons updateData={updateData} setSortBy={setSortBy}/>

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