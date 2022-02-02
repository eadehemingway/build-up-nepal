import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { InsetLabelLayer } from "./Layer-labels-inset";
import { insetMapStyle } from "./style-inset";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


export function InsetMap({ onClick }) {

    const $inset_map = useRef();

    useEffect(()=>{
        if (!$inset_map.current) return;
        let hoveredStateId = null;
        let clickedStateId = null;


        $inset_map.current.on("mouseenter", "provinces-fill", () => {
            $inset_map.current.getCanvas().style.cursor = "pointer";
        });


        $inset_map.current.on("mousemove", "provinces-fill", (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    $inset_map.current.setFeatureState(
                        { source: "provinces", id: hoveredStateId },
                        { hover: false }
                    );
                }
                hoveredStateId = e.features[0].id;

                $inset_map.current.setFeatureState(
                    { source: "provinces", id: hoveredStateId },
                    { hover: true }
                );
            }
        });

        $inset_map.current.on("click", "provinces-fill", (e) => {
            if (e.features.length > 0) {
                if (clickedStateId !== null) {
                    $inset_map.current.setFeatureState(
                        { source: "provinces", id: clickedStateId },
                        { click: false }
                    );
                }
                clickedStateId = e.features[0].id;

                $inset_map.current.setFeatureState(
                    { source: "provinces", id: clickedStateId },
                    { click: true }
                );
            }
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        $inset_map.current.on("mouseleave", "provinces-fill", () => {
            $inset_map.current.getCanvas().style.cursor = "";

            if (hoveredStateId !== null) {
                $inset_map.current.setFeatureState(
                    { source: "provinces", id: hoveredStateId },
                    { hover: false }
                );
            }

            hoveredStateId = null;
        });
    });

    return (
        <>
            <MapGL
                ref={$inset_map}
                {...map_attributes}
                onClick={onClick}
                style= {{
                    "position": "absolute",
                    "border": "1px solid blue",
                    "boxSizing": "border-box",
                    "top": 20,
                    right: 0,
                    height: "200px",
                    width: "300px",
                    overflow: "hidden",
                }}
            >
                <Layer
                    id="provinces-outline"
                    source="provinces"
                    type="line"
                    paint={{ "line-width": 0.2, "line-color": "red" }}

                />
                <InsetLabelLayer/>

            </MapGL>
        </>

    );
}

const map_attributes = {
    mapStyle: insetMapStyle,
    interactiveLayerIds:["provinces-fill"],
    mapboxAccessToken:MAPBOX_TOKEN,
    scrollZoom:false,
    doubleClickZoom:false,
    dragPan:false,
    touchZoom:false,
    touchRotate:false,
    keyboard:false,
    initialViewState:{
        latitude: 28.0,
        longitude: 84.2,
        zoom: 4.6
    }
};

