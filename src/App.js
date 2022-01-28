import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";
import { data } from "./data/data";
import { Markers } from "./Markers";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


function App() {
    const [viewport, setViewport] = useState({
        latitude: 28.767,
        longitude: 85.251,
        zoom: 6.1
    });
    // const data_one = [data[0]]
    // const geo_json_points = data_one.map((d)=>{
    //   return {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "Point",
    //       "coordinates": [d.Latitude, d.Longitude]
    //     },
    //     "properties": {
    //       ...d
    //     }
    //   }
    // })

    // console.log(JSON.stringify(geo_json_points))


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
                    <Layer type="line"/>
                    <Markers/>
                </Source>

            </MapGL>

        </>

    );
}

export default App;
