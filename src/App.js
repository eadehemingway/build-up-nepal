import React, { useState } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { countries } from "./data/countries";
import { dataLayer } from "./data_layer";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5ZTV2bnMwM2YyMnVvMWx0bzdteXAzIn0.D9lLHLuJiRLEIglPhi-HKg";


function App() {
    const [viewport, setViewport] = useState({
        latitude: 28.767,
        longitude: 85.251,
        zoom: 6.1
    });


    return (
        <>
            <MapGL
                {...viewport}
                width="100vw"
                height="100vh"
                style= {{ "position": "absolute" }}
                onViewportChange={setViewport}
                mapStyle="mapbox://styles/eadehem/ckyx7o0ag001r14o242ghhzpr"
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >
                {/* Add <source and <Layer compoennts if you need to add layers e.g. data */}
                {/* <Source type="geojson" data={countries}>
                    <Layer {...dataLayer}/>
                </Source> */}
            </MapGL>

        </>

    );
}

export default App;
