import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import { dark_blue } from "../../shared/colors";

const main_labels = {
    "type": "FeatureCollection",
    "name": "nepal_main",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "label": "NEPAL" }, "geometry": { "type": "Point", "coordinates": [ 84.0934086, 29.1961753, 0.0 ] } },
    ]
};

export function MainLabelsLayer() {

    return (
        <>
            <Source id="main-labels" type="geojson" data={main_labels}>
                <Layer
                    id = "poi-labels"
                    type = "symbol"
                    source = "places"
                    minzoom = {0}
                    maxzoom = {8}
                    layout = {{
                        "text-field": ["get", "label"],
                        "text-variable-anchor": ["top", "bottom", "left", "right"],
                        "text-radial-offset": 0.5,
                        "text-justify": "center",
                        "text-font": ["Etna Black"],
                        "text-letter-spacing": 1,
                        "text-size": 26,
                        "text-allow-overlap": true,
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                        "text-ignore-placement": true
                    }}
                    paint = {{
                        "text-color": dark_blue,
                    }}
                />

            </Source>
        </>
    );
}

