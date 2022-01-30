import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled, { keyframes } from "styled-components";



export function LoadingScreen({ loaded }) {

    return (

        <Overlay loaded={loaded}>
            <DotWrapper>
                <Dot delay="0s" />
                <Dot delay=".1s" />
                <Dot delay=".2s" />
            </DotWrapper>
        </Overlay>


    );
}

const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 60px }
  100% { margin-bottom: 0 }
`;

const Dot = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 5px;
  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${props => props.delay};
`;
const DotWrapper = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: center;
  height: 100%;
  align-items: center;
`;
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFD6FF;
    z-index: 5;
    opacity: ${({ loaded })=> loaded ? 0 : 1};
    // display: ${({ loaded })=> loaded ? "none" : "block"};
    transition: opacity 3s;
    pointer-events: ${({ loaded })=> loaded ? "none" : "auto"};

`;

