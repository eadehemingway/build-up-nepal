import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import nepal_outline  from "../../data/nepal_outline.json";
import provinces from "../../data/provinces.json";



export function ProvinceFillLayer({ zoomed_province }) {

    const zoomed_prov_or_str = zoomed_province || "";

    // ["get", "state"] // gets province id
    // ["case", ['==', zoomed_province, ["get", "state"]], 'pink', 'blue']
    return (

        <Source id="provinces" type="geojson" data={provinces}>

            <Layer
                id="province-fill-main"
                type="fill"
                source="provinces"
                paint={
                    { "fill-color":"#d3f0f7",
                        // "fill-opacity": ["case",
                        //     ["==", zoomed_province, ["get", "STATE"]],
                        //     0,
                        //     1
                        // ]
                        // "fill-opacity": [
                        //     "match",
                        //     ["get", "STATE"], zoomed_prov_or_str,
                        //     1,
                        //     0
                        // ],
                    }
                }

                // ["case",
                //     ["==", zoomed_province, ["get", "STATE"]],
                //     "pink",
                //     "blue"
                // ]
                // [
                //     "case",
                //     ["boolean", ["get", "STATE"], zoomed_province],
                //     "#d3f0f7",
                //     "#FFAEFF"
                // ]



            />

        </Source>


    );
}

