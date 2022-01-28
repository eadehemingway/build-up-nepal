import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";
import { data } from "./data/data";
import { Markers } from "./Markers";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


const country_outline = {
    type: "line",
    paint: { "line-color": "red" },
};


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
                <Source type="geojson" data={nepal_outline} >

                    <Markers/>
                </Source>

            </MapGL>

        </>

    );
}

export default App;
