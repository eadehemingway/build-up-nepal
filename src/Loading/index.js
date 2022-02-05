import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled, { keyframes } from "styled-components";
import brick_machine from "./../assets/brick_machine.gif";
import brick_machine_video from "./../assets/nepal_bricks.mp4";
import build_up_nepal_logo from "./../assets/build_up_nepal_logo.svg";

export function LoadingScreen({ loaded }) {

    const [load_delay, setLoadDelay] = useState(false);
    let delay_seconds = 10;
    if (loaded) setTimeout(function(){ setLoadDelay(true); }, delay_seconds * 1000);

    return (
        <Overlay loaded={false}>
            <Standfirst>
                <GifWrapper width="100%" autoPlay muted>
                    <source src={brick_machine_video} type="video/mp4"></source>
                </GifWrapper>
                <FirstCharacter>O</FirstCharacter>
                <P>
                ur machines are made of quality steel and developed for maximum efficiency. Since 2015 we have been improving and refining our machines to increase durability and output. Our uniquely effective manual machines makes it possible to produce at high capacity even in remote areas. The machines come with 12 months warranty.
                </P>
            </Standfirst>
            <Logo background_image={build_up_nepal_logo}></Logo>
        </Overlay>
    );
}

const Logo = styled.div`
    width: 50px;
    height: 40px;
    background-image: ${({ background_image }) => `url("${background_image}")`};
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    display: block;
    margin: 40px auto 0 auto;
`;

const Standfirst = styled.div`
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    width: 500px;
    display: block;
    margin: 20px auto 0px auto;
    justify-content: center;
    align-items: center;
    color: ${({ enterprise }) => enterprise ? "red" : "#1400a3"};
    @media only screen and (max-width: 600px) {
        width: calc(100% - 40px);
    }
`;

const FirstCharacter = styled.span`
    float: left;
    font-family: etna;
    font-weight: 900;
    font-size: 95px;
    line-height: 80px;
    padding-right: 8px;
    padding-left: 3px;
`;

const P = styled.p`
    width: 100%;
    line-height: 20px;
    margin: 0 0 20px 0;
`;

const GifWrapper = styled.video`
  margin: auto;
  display: block;
  width: 100%;
`;

const Overlay = styled.div`
    position: absolute;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFD6FF;
    z-index: 9;
    opacity: ${({ loaded })=> loaded ? 0 : 1};
    pointer-events: ${({ loaded })=> loaded ? "none" : "auto"};
`;

