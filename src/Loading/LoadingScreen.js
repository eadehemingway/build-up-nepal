import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled, { keyframes } from "styled-components";
import brick_machine from "./../assets/brick_machine.gif";

export function LoadingScreen({ loaded }) {

    const [load_delay, setLoadDelay] = useState(false);
    let delay_seconds = 6;
    if (loaded) setTimeout(function(){ setLoadDelay(true); }, delay_seconds * 1000);

    return (
        <Overlay loaded={load_delay}>
            <GifWrapper>
            </GifWrapper>
        </Overlay>
    );
}

const GifWrapper = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  background: url("${brick_machine}");
  background-repeat: norepeat;
  background-size: cover;
  background-position: center;
  width: 500px;
  height: 500px;
`;
const Overlay = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFD6FF;
    z-index: 5;
    opacity: ${({ loaded })=> loaded ? 0 : 1};
    pointer-events: ${({ loaded })=> loaded ? "none" : "auto"};
`;

