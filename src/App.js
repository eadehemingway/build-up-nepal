import React, { useState, useMemo } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import { useEffect } from "react/cjs/react.development";
import styled from "styled-components";
import { Map } from "./Map/index.js";
import { StackedBars } from "./Stacks/index.js";
import { IconChart } from "./IconChart";
import { TextBox } from "./InfoOverlay";

var font = new FontFace("code-saver", "url(https://use.typekit.net/af/58ae6c/00000000000000007735b602/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3)");

function App() {
    const [highlight_id, setHighlightId] = useState(null);
    const [font_loaded, setFontLoaded] = useState(null);
    const [highlight_locked, setHighlightLocked] = useState(false);
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    useEffect (() => {
        font.load().then(function(font) {
            document.fonts.add(font);
            setFontLoaded(true);
        });
    }, []);

    function onClick(e){
        setHighlightLocked(false);
    }
    return (
        <div onClick={onClick}>
            {font_loaded &&
                <>
                    <IconChart
                        highlight_id={highlight_id}
                        setHighlightId={setHighlightId}
                        setHighlightLocked={setHighlightLocked}
                        highlight_locked={highlight_locked}
                        width={300}
                        height={windowH - 10}
                    />
                    <Map
                        highlight_id={highlight_id}
                        setHighlightId={setHighlightId}
                        setHighlightLocked={setHighlightLocked}
                        width={windowW - 300}
                        height={windowH - 300}
                        highlight_locked={highlight_locked}
                    />

                    <StackedBars
                        highlight_id={highlight_id}
                        setHighlightId={setHighlightId}
                        setHighlightLocked={setHighlightLocked}
                        highlight_locked={highlight_locked}
                        width={windowW - 300}
                        height={300}
                    />
                    <TextBox
                        highlight_locked={highlight_locked}
                        highlight_id={highlight_id}
                        setHighlightLocked={setHighlightLocked}
                    />
                </>
            }
        </div>

    );
}

export default App;
