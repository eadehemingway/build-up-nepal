import React, { useState, useMemo } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import { useEffect } from "react/cjs/react.development";
import { Mobile } from "./AppMobile.js";
import { Desktop } from "./AppDesktop.js";

var font = new FontFace("code-saver", "url(https://use.typekit.net/af/58ae6c/00000000000000007735b602/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3)");

function App() {
    const [highlight_id, setHighlightId] = useState(null);
    const [font_loaded, setFontLoaded] = useState(null);
    const [highlight_locked, setHighlightLocked] = useState(false);
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const is_mobile = windowW < 500;
    useEffect (() => {
        font.load().then(function(font) {
            document.fonts.add(font);
            setFontLoaded(true);
        });
    }, []);


    return (
        <>
            {font_loaded &&
               (is_mobile ?
                   <Mobile
                       highlight_id={highlight_id}
                       setHighlightId={setHighlightId}
                       setHighlightLocked={setHighlightLocked}
                       windowW={windowW}
                       windowH={windowH}
                       highlight_locked={highlight_locked}
                   /> :
                   <Desktop
                       highlight_id={highlight_id}
                       setHighlightId={setHighlightId}
                       setHighlightLocked={setHighlightLocked}
                       windowW={windowW }
                       windowH={windowH}
                       highlight_locked={highlight_locked}
                   />

               )
            }
        </>


    );
}

export default App;
