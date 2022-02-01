import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";

const main_cities = {
    "type": "FeatureCollection",
    "name": "nepal_main",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "label": "Kathmandu" }, "geometry": { "type": "Point", "coordinates": [ 85.3239605, 27.7172453, 0.0 ] } },
        { "type": "Feature", "properties": { "label": "Pokhara" }, "geometry": { "type": "Point", "coordinates": [ 83.9855674, 28.2095831, 0.0 ] } }
    ]
};

export function MainCitiesLayer() {

    return (
        <>
            <Source id="main-cities" type="geojson" data={main_cities}>
                <Layer
                    id = "city-labels"
                    type = "symbol"
                    source = "places"
                    minzoom = {0}
                    maxzoom = {24}
                    layout = {{
                        "text-field": ["get", "label"],
                        "text-variable-anchor": ["top", "bottom", "left", "right"],
                        "text-radial-offset": 0.5,
                        "text-justify": "center",
                        "text-font": ["Arial Unicode MS Regular"],
                        "text-letter-spacing": 0,
                    }}
                    paint = {{
                        "text-color": "#1400a3",
                    }}
                />

            </Source>
        </>
    );
}

