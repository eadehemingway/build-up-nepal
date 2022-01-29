import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { Markers } from "./Markers";
import bbox from "@turf/bbox";
import { ContourLayer } from "./ContourLayer";
import { PopulationLayer } from "./PopulationLayer";
import { CountryOutlineLayer } from "./CountryOutlineLayer";
import MAP_STYLE from "./style.json";
import districs from "./data/province_outlines.json";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


export function Map() {
    const [contour_visible, setContourVisible] = useState(true);
    const [population_visible, setPopulationVisible] = useState(true);
    const [province_outline_visible, setProvinceOutlineVisible] = useState(true);
    const [country_outline_visible, setCountryOutlineVisible] = useState(true);
    const [markers_visible, setMarkerVisible] = useState(true);

    const [loaded, setLoaded] = useState(false);
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
            <button onClick={()=> setProvinceOutlineVisible((v)=> !v)}>province outline toggle</button>
            <button onClick={()=> setCountryOutlineVisible((v)=> !v)}>country outline toggle</button>
            <button onClick={()=> setMarkerVisible((v)=> !v)}>marker toggle</button>
            <Overlay loaded={loaded}/>
            <MapGL
                ref={mapRef}
                {...map_attributes}
                onLoad={()=> setLoaded(true)}
            >


                <ContourLayer contour_visible={contour_visible}/>
                <PopulationLayer population_visible={population_visible}/>
                <CountryOutlineLayer country_outline_visible={country_outline_visible}/>
                {province_outline_visible && <Layer id="provinces-outline" source="provinces" type="line" paint={{ "line-width": 0.2, "line-color": "red" }}/>}
                {markers_visible &&  <Markers />}




            </MapGL>
        </>

    );
}

const map_attributes = {
    mapStyle: {
        ...MAP_STYLE,
        sources: {
            ...MAP_STYLE.sources,
            "provinces": {
                type: "geojson",
                data: districs
            }
        },

    },
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

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff1E0;
    z-index: 5;
    opacity: ${({ loaded })=> loaded ? 0 : 1};
    display: ${({ loaded })=> loaded ? "none" : "block"};
    transition: opacity 1s;

`;