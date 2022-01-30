import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import marker_geojson from "./data/markers_geojson.json";


export function TextBox( { highlight_obj } ) {
    if (!highlight_obj) return null;

    return (
        <Container>
            <P>{highlight_obj.Description}</P>
            <P>Total houses built: {highlight_obj["Houses built TOTAL"]}</P>
            <P>Total jobs: {highlight_obj["Total jobs"]}</P>
            <P>C02 saved: {highlight_obj["CO2 saved"]}</P>

        </Container>
    );
}


const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 350px;
    height: 400px;
    border: 2px solid red;
    padding: 30px;
`;

const P = styled.p`
    text-align: right;
`;