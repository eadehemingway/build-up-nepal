import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import provinces from "../../data/provinces.json";


export function UnzoomedProvFill({ zoomed_province }) {
    const is_zoomed = `${!!zoomed_province}`;
    return (

        <Source id="provinces" type="geojson" data={provinces}>
            <Layer
                id="province-fill-main"
                type="fill"
                source="provinces"
                paint={{
                    "fill-color":"red",
                    "fill-opacity": [
                        "match",
                        is_zoomed,
                        "true",
                        0,
                        1
                    ] }}
            />
        </Source>


    );
}


