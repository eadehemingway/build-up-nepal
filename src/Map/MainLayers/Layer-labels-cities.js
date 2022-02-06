import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import { dark_blue, turquoise } from "../../shared/colors";

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
                        "icon-image": "location_marker",
                        "icon-size": 0.2,
                        "icon-anchor": "bottom",
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                        "text-field": ["get", "label"],
                        "text-variable-anchor": ["bottom"],
                        "text-justify": "center",
                        "text-font": ["Code Saver Regular"],
                        "text-allow-overlap": true,
                        "text-letter-spacing": 0,
                        "text-size": 13,
                        "text-offset": [0, -0.75],
                    }}
                    paint = {{
                        "text-color": dark_blue,
                        "text-halo-width": 3,
                        "text-halo-color": turquoise,
                        "text-halo-blur": 2,
                    }}
                />

            </Source>
        </>
    );
}

