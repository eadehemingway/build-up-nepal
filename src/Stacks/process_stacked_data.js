import { data } from "../data/data";

const chosen_metrics = [{
    name: "CO2 saved",
    caption: "Total CO₂ saved (tonnes)",
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


export function getStackedData( chart_height, chart_margin) {
    let mapped_metrics = [...chosen_metrics];

    let mapped_data = mapped_metrics.map(metric => {
        chosen_sortings["metric"] = metric.name;
        return stack(metric, chosen_sortings, chart_height, chart_margin);
    });

    return mapped_data;
}

function stack(metric, sortings, chart_height, chart_margin) {
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
            height: Math.min(height, 50),
            x: {},
            width: {},
            y: 0,
            "flag-status": d["flag-status"]
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
            if (sorting === "metric") {
                axis[sorting] = [
                    { label: stacked.data[0].value["metric"], x: 0, width: 1, y: 0, align: "left" },
                    { label: stacked.data[stacked.data.length - 1].value["metric"], x: 1, width: 0, y: 0, align: "right" },
                ];
            } else {
                let relevant_axis = axis[sorting].filter(e => e.label === d.value[sorting]);
                if (!relevant_axis.length) axis[sorting].push({ label: d.value[sorting], x: x, width: proportion, y: 0, align: "left" });
                else relevant_axis[0].width += proportion;
            }
            x += proportion;
        });
        stacked.axis = axis;
    }
    return stacked;
}

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


