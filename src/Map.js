import React, { useEffect, useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";
import { data } from "./data/data";
import { Markers } from "./Markers";
import province_outlines from "./data/province_outlines.json";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";
// const viewport_first_house = {
//     latitude: 27.98587206,
//     longitude: 84.88259201,
//     zoom: 9.3
// };

export function Map() {
    const [viewport, setViewport] = useState({
        latitude: 28.767,
        longitude: 85.251,
        zoom: 6.1
    });
    const [contour_visible, setContourVisible] = useState(true);
    const [population_visible, setPopulationVisible] = useState(true);
    const [outline_visible, setOutlineVisible] = useState(true);
    const [markers_visible, setMarkerVisible] = useState(true);

    // useEffect(()=>{

    //     setTimeout(()=>{
    //         setViewport(viewport_first_house);
    //     }, 1000);
    // }, []);

    return (
        <>
            <button onClick={()=> setContourVisible((v)=> !v)}>contour toggle</button>
            <button onClick={()=> setPopulationVisible((v)=> !v)}>pop toggle</button>
            <button onClick={()=> setOutlineVisible((v)=> !v)}>outline toggle</button>
            <button onClick={()=> setMarkerVisible((v)=> !v)}>marker toggle</button>
            {/* <button onClick={(e)=> }>GO TO FIRST HOUSE</button> */}
            <MapGL
                {...viewport}
                width="100vw"
                height="100vh"
                style= {{ "position": "absolute" }}
                onViewportChange={setViewport}
                mapStyle={"mapbox://styles/eadehem/ckyyyndyw004614s0q903vsci"}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                // transitionDuration={2500}
                // transitionInterpolator={new LinearInterpolator()}
            >
                {/* <Source type="geojson" data={nepal_outline} >
                    <Layer type="line" paint={{ "line-color": outline_visible ? "red" : "white" }}/>
                </Source> */}
                <Source type="geojson" data={province_outlines} >
                    <Layer type="line" paint={{ "line-color": outline_visible ? "red" : "white" }}/>
                </Source>
                <Source id="contour_source" type="raster" url={"mapbox://eadehem.9bmo07eb"} tileSize={256}>
                    <Layer
                        id="contour_layer"
                        type="raster"
                        source="contour_source"
                        paint={{ "raster-contrast": 1 , "raster-opacity": contour_visible ? 1: 0 }}
                    />
                </Source>
                <Source id="population_source" type="raster" url={"mapbox://eadehem.5a0w2g3f"} tileSize={256}>
                    <Layer
                        id="population_layer"
                        type="raster"
                        source="population_source"
                        paint={{ "raster-contrast": 1 , "raster-opacity": population_visible ? 1: 0  }}
                    />
                </Source>
                <Markers markers_visible={markers_visible}/>
            </MapGL>
        </>

    );
}

