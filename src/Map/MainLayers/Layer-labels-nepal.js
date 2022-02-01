import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";

const main_labels = {
    "type": "FeatureCollection",
    "name": "nepal_main",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "label": "NEPAL" }, "geometry": { "type": "Point", "coordinates": [ 83.2934086, 29.2961753, 0.0 ] } },
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
                    maxzoom = {6.5}
                    layout = {{
                        "text-field": ["get", "label"],
                        "text-variable-anchor": ["top", "bottom", "left", "right"],
                        "text-radial-offset": 0.5,
                        "text-justify": "center",
                        "text-font": ["Etna Black", "Arial Unicode MS Regular"],
                        "text-letter-spacing": 2,
                    }}
                    paint = {{
                        "text-color": "#1400a3",
                    }}
                />

            </Source>
        </>
    );
}

