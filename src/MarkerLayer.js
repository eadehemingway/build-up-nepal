import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";
import marker_geojson from "./data/markers_geojson.json";


export function MarkerLayer( { markers_visible, highlight_id } ) {

    const highlight_id_or_str = highlight_id || "";
    return (
        <>
            <Source id="marker-source" type="geojson" data={marker_geojson} promoteId={"#"}>
                {markers_visible && (
                    <Layer
                        id="markers-layer"
                        type="symbol"
                        layout={{ "icon-image": "custom-marker", "icon-size": 0.1 }}
                        source="marker-source"
                        // paint = {{ "circle-color":"red",
                        //     "circle-stroke-width": [
                        //         "match",
                        //         ["get", "#"], highlight_id_or_str,
                        //         3,
                        //         0
                        //     ],
                        //     "circle-stroke-color": "navy"

                        // }}
                    />
                )}
            </Source>
        </>
    );
}

