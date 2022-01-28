import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";
import { data } from "./data/data";
import { Markers } from "./Markers";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";

// const layers = {
// contours:

// }


const styles = {
    cont: "mapbox://styles/eadehem/ckyyylv7n003r15l82ujz01hz",
    pop: "mapbox://styles/eadehem/ckyyylprs000g14plz3eoefhk",
    pop_and_cont: "mapbox://styles/eadehem/ckyywkvcc000l14rzjcupuaqt",
    blank: "mapbox://styles/eadehem/ckyyyndyw004614s0q903vsci"
};

function App() {
    const [viewport, setViewport] = useState({
        latitude: 28.767,
        longitude: 85.251,
        zoom: 6.1
    });

    const [contour_visible, setContourVisible] = useState(true);
    const [population_visible, setPopulationVisible] = useState(true);
    const [outline_visible, setOutlineVisible] = useState(true);
    const [markers_visible, setMarkerVisible] = useState(true);


    function toggleContours(){
        setContourVisible((v)=> !v);
    }

    function togglePopulation(){
        setPopulationVisible((v)=> !v);
    }

    function toggleOutline(){
        setOutlineVisible((v)=> !v);
    }
    function toggleMarker(){
        setMarkerVisible((v)=> !v);
    }

    return (
        <>
            <button onClick={toggleContours}>contour toggle</button>
            <button onClick={togglePopulation}>pop toggle</button>
            <button onClick={toggleOutline}>outline toggle</button>
            <button onClick={toggleMarker}>marker toggle</button>
            <MapGL
                {...viewport}
                width="100vw"
                height="100vh"
                style= {{ "position": "absolute" }}
                onViewportChange={setViewport}
                mapStyle={styles.blank}
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                <Source type="geojson" data={nepal_outline} >
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

export default App;
