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
                        id="markers"
                        type="circle"
                        source="marker-source"
                        paint = {{ "circle-color": [
                            "match",
                            ["get", "#"], highlight_id_or_str,
                            "red",
                            "green"
                        ] }}
                    />
                )}
            </Source>
        </>
    );
}

