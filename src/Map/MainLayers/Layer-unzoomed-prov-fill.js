import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import provinces from "../../data/provinces.json";
import { turquoise } from "../../shared/colors";


export function UnzoomedProvFill({ zoomed_province }) {

    const zoomed_prov_or_NO = zoomed_province ? `${zoomed_province}` : "NO";

    return (
        <Source id="provinces" type="geojson" data={provinces}>
            <Layer
                id="province-fill-unzoomed-main"
                type="fill"
                source="provinces"
                paint={{
                    "fill-color": turquoise ,
                    "fill-opacity":["match", zoomed_prov_or_NO, "NO", 1, 0]

                }}
            />
        </Source>


    );
}


