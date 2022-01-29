import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import provinces from "./data/mini_map.json";
import { insetMapStyle } from "./inset_map_style";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


export function InsetMap({ onClick }) {

    const mapRef = useRef();
    return (
        <>
            <MapGL
                ref={mapRef}
                {...map_attributes}
                onClick={onClick}
            >
                <Layer id="provinces-outline" source="provinces" type="line" paint={{ "line-width": 0.2, "line-color": "red" }}/>

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
    style:{
        "position": "absolute",
        "border": "1px solid blue",
        "boxSizing": "border-box",
        "top": 20,
        right: 0,
        height: "400px",
        width: "600px",
        overflow: "hidden"
    },
    initialViewState:{
        latitude: 28.0,
        longitude: 85.251,
        zoom: 5.2
    }
};

