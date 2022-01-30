import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { Map } from "./Map";
import { StackedBars } from "./StackedBars";


function App() {
    const [locked_highlight_id, setLockedHighlightId] = useState(null);
    return (
        <>
            <Map
                locked_highlight_id={locked_highlight_id}
                setLockedHighlightId={setLockedHighlightId}
            />

            <StackedBars
                locked_highlight_id={locked_highlight_id}
                setLockedHighlightId={setLockedHighlightId}
            />
        </>

    );
}

export default App;
