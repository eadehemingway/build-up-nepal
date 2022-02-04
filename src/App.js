import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { Map } from "./Map/index.js";
import { StackedBars } from "./Stacks/index.js";
import { IconChart } from "./IconChart";


function App() {
    const [highlight_id, setHighlightId] = useState(null);

    return (
        <>
            <IconChart
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
            />
            {/* <Map
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
            />

            <StackedBars
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
            /> */}
        </>

    );
}

export default App;
