import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { Map } from "./Map";
import { StackedBars } from "./StackedBars";


function App() {

    return (
        <>
            <Map/>
            <StackedBars/>
        </>

    );
}

export default App;
