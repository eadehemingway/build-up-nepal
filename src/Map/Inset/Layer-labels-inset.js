import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";

const centroids ={ "type":"FeatureCollection", "features": [
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[87.2744655578353,27.21018695834508] },"properties":{ "STATE":"1" } },
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[85.69196221461337,26.93018483656625] },"properties":{ "STATE":"2" } },
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[85.4728324358283,27.678387829485434] },"properties":{ "STATE":"3" } },
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[84.05186696892089,28.40888716175867] },"properties":{ "STATE":"4" } },
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[82.68857806116901,28.051257351158373] },"properties":{ "STATE":"5" } },
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[82.28420139126219,29.253437661711367] },"properties":{ "STATE":"6" } },
    { "type":"Feature","geometry":{ "type":"Point","coordinates":[80.94201693324878,29.32484887833531] },"properties":{ "STATE":"7" } }
] };

export function InsetLabelLayer() {

    return (
        <>
            <Source id="inset-labels" type="geojson" data={centroids}>
                <Layer
                    id = "poi-labels"
                    type = "symbol"
                    source = "inset-labels"
                    minzoom = {0}
                    maxzoom = {6.5}
                    layout = {{
                        "text-field": ["get", "STATE"],
                        "text-justify": "center",
                        "text-font": ["Code Saver Regular"],
                        "text-letter-spacing": 2,
                        "text-size": 13,
                    }}
                    paint = {{
                        "text-color": "#1400a3",
                    }}
                />

            </Source>
        </>
    );
}

