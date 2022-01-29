import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";



export function CountryOutlineLayer({ country_outline_visible }) {

    return (

        <Source id="country_outline" type="geojson" data={nepal_outline}>
            {country_outline_visible && (
                <Layer
                    id="country_outline_layer"
                    type="line"
                    source="country_outline"
                    paint={{ "line-width": 0.4, "line-color": "red" }}

                />
            )}
        </Source>


    );
}

