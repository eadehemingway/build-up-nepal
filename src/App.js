import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { Map } from "./Map";
import { StackedBars } from "./StackedBars";


function App() {
    const [highlighted_id, setHighlightedId] = useState(null);
    return (
        <>
            {/* <Map
                highlighted_id={highlighted_id}
                setHighlightedId={setHighlightedId}
            /> */}

            <StackedBars
                highlighted_id={highlighted_id}
                setHighlightedId={setHighlightedId}
            />
        </>

    );
}

export default App;
