import React, { useEffect, useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { Map } from "./Map";
import * as d3 from "d3";


export function StackedBar({ bar_data }) {

    useEffect(()=>{
        drawBars();
    }, []);

    function drawBars(){
    // stuff you only want to happen once ...
    // might not need it, depends what you want to do
        const svg = d3.select("#shared-svg");
        svg.append("g")
            .attr("class", "co2-bar");
    }

    useEffect(()=>{
        updateBars();
    }, [bar_data]);

    function updateBars(){
        const g = d3.select(".co2-bar");

        const bars = g.selectAll("rect")
            .data(bar_data);

        const entering_bars = bars.enter()
            .append("rect");

        const update_bars = bars.merge(entering_bars);

        update_bars
            .attr("width", 100)
            .attr("height", 100)
            .attr("x", (d, i)=> i * 200)
            .attr("y", 100);

        bars.exit()
            .remove();
    }

    return null;
}


