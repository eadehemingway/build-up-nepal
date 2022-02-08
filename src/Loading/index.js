import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled, { keyframes } from "styled-components";
import brick_machine from "./../assets/brick_machine.gif";
import brick_machine_video from "./../assets/nepal_bricks.mp4";
import build_up_nepal_logo from "./../assets/build_up_nepal_logo.svg";
import { base_pink, dark_blue, dark_pink, red } from "../shared/colors";

export function LoadingScreen({ loaded }) {
    const [vid_opacity, setVidOpacity] = useState(0);
    const [overlay_opacity, setOverlayOpacity] = useState(1);
    const [load_delay, setLoadDelay] = useState(false);
    let delay_seconds = 5;
    if (loaded) setTimeout(function(){ setLoadDelay(true); }, delay_seconds * 1000);

    useEffect(()=>{
        setVidOpacity(1);
    }, []);

    function hideOverlay() {
        setOverlayOpacity(0);
    }

    return (
        <Overlay overlay_opacity={overlay_opacity}>
            <Standfirst>
                <GifWrapper width="100%" autoPlay muted loop vid_opacity={vid_opacity}>
                    <source src={brick_machine_video} type="video/mp4"></source>
                </GifWrapper>
                <FirstCharacter>O</FirstCharacter>
                <P>
                ur Interlocking Brick CSEB machines are made of quality steel and developed for maximum efficiency. These, along with training and support, empowering entrepreneurs to produce high-quality bricks, using local materials ideally suited to rural communities.
                </P>
            </Standfirst>
            <EnterButton onClick={hideOverlay} loaded={load_delay} >Enter</EnterButton>
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
    margin: 20px auto 0 auto;
`;

const Standfirst = styled.div`
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    width: 350px;
    display: block;
    margin: 200px auto 0px auto;
    justify-content: center;
    align-items: center;
    color: ${({ enterprise }) => enterprise ? red : dark_blue};


    @media only screen and (max-width: 600px) {
        width: calc(100% - 40px);
        margin-top: 0;
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
  min-height: 250px;
  opacity: ${({ vid_opacity }) => vid_opacity };
  transition: opacity 1s;
  transition-delay: 0.5s;
`;

const Overlay = styled.div`
    position: absolute;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${base_pink};
    z-index: 9;
    transition: opacity 1s;
    opacity: ${({ overlay_opacity }) => overlay_opacity};
    pointer-events: ${({ overlay_opacity }) => overlay_opacity ? "auto" : "none"};
`;

const EnterButton = styled.button`
    border: 1px solid ${dark_blue};
    color: ${dark_blue};
    opacity: ${({ loaded }) => loaded ? "1" : "0"};
    pointer-events: ${({ loaded }) => loaded ? "auto" : "none"};
    padding: 10px;
    width: 100px;
    line-height: normal;
    font-family: code-saver, sans-serif;
    font-size: 12px;
    background: ${base_pink};
    outline: none;
    transition: opacity 1s;
    cursor: pointer;
    margin: 10px auto 0 auto;
    display: block;
    :hover {
        background: ${dark_pink};
    }
    :focus {
        outline: none;
    }
`;

