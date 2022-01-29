import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";



export function ContourLayer({ contour_visible }) {

    return (

        <Source id="contour_source" type="raster" url={"mapbox://eadehem.9bmo07eb"} tileSize={256}>
            {contour_visible && (
                <Layer
                    id="contour_layer"
                    type="raster"
                    source="contour_source"
                    paint={{ "raster-contrast": 1 , "raster-opacity": 1 }}
                />

            )}
        </Source>


    );
}

