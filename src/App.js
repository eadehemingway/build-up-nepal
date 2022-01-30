import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import "./App.css";
import { Map } from "./Map";
import { StackedBars } from "./StackedBars";


function App() {
    const [highlight_id, setHighlightId] = useState(null);

    return (
        <>
            <Map
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
            />

            <StackedBars
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
            />
        </>

    );
}

export default App;
