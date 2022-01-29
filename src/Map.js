import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";
import { data } from "./data/data";
import { Markers } from "./Markers";
import province_outlines from "./data/province_outlines.json";
import { MapStyle } from "./Map-style";
import bbox from "@turf/bbox";
import { ContourVisible } from "./ContourLayer";
import { PopulationLayer } from "./PopulationLayer";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


export function Map() {
    const [contour_visible, setContourVisible] = useState(true);
    const [population_visible, setPopulationVisible] = useState(true);
    const [outline_visible, setOutlineVisible] = useState(true);
    const [markers_visible, setMarkerVisible] = useState(true);


    const mapRef = useRef();
    const onClick = (event) => {
        if (!mapRef.current) return;
        const feature = event.features[0];
        if (feature) {
            // calculate the bounding box of the feature
            const [minLng, minLat, maxLng, maxLat] = bbox(feature);
            mapRef.current.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat]
                ],
                { padding: 40, duration: 3500 }
            );
        }
    };

    return (
        <>
            <button onClick={()=> setContourVisible((v)=> !v)}>contour toggle</button>
            <button onClick={()=> setPopulationVisible((v)=> !v)}>pop toggle</button>
            <button onClick={()=> setOutlineVisible((v)=> !v)}>outline toggle</button>
            <button onClick={()=> setMarkerVisible((v)=> !v)}>marker toggle</button>
            <MapGL
                ref={mapRef}
                {...map_attributes}
                onClick={onClick}
            >
                <ContourVisible contour_visible={contour_visible}/>
                <PopulationLayer population_visible={population_visible}/>
                {outline_visible && <Layer id="provinces-outline" source="provinces" type="line" paint={{ "line-width": 0.2, "line-color": "red" }}/>}
                {markers_visible &&  <Markers />}

            </MapGL>
        </>

    );
}

const map_attributes = {
    mapStyle:MapStyle,
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
        "border": "5px solid red",
        "boxSizing": "border-box",
        "top": 20,
        right: 0,
        left: 0,
        overflow: "hidden"
    },
    initialViewState:{
        latitude: 28.767,
        longitude: 85.251,
        zoom: 6.1
    }
};