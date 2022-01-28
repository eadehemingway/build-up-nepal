import React, { useState } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_geojson } from "./data/nepal_geojson";
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
                mapStyle="mapbox://styles/eadehem/ckyyibb6l007y16of204c83uq"
                mapboxApiAccessToken={MAPBOX_TOKEN}
            >

                <Source type="geojson" data={nepal_geojson}>
                    <Layer {...dataLayer}/>
                </Source>
            </MapGL>

        </>

    );
}

export default App;
