import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import provinces from "../../data/provinces.json";


export function ZoomedProvinceFill({ zoomed_province }) {
    const zoomed_prov_or_str = `${zoomed_province}`;
    return (

        <Source id="provinces" type="geojson" data={provinces}>
            <Layer
                id="province-fill-main"
                type="fill"
                source="provinces"
                paint={{ "fill-color":"#d3f0f7" }}
                filter={["==", ["get", "STATE"], zoomed_prov_or_str]}
            />
        </Source>


    );
}

