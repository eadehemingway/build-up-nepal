import React, { useState, useMemo } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { data } from "../data/data";
import icon_close from "../assets/icon_close.svg";


export function TextBox( { setTextBoxOpen, highlight_id, textBoxOpen } ) {
    const highlightObj = useMemo(() => data.find(d => d.id === highlight_id), [highlight_id]);
    if (!highlightObj) return null;
    const enterprise = highlightObj["flag-status"] === "enterprise";
    const kicker = enterprise ? "Enterprise" : "One-off";
    const flag_path = enterprise ? "M 0 0 L 22.5 0 L 11.333 7.5 L 22.5 16.25 L 0 16.25 Z" : "M 0 0 L 22.5 7.5 L 0 13.7 Z";
    const flag_color = enterprise ? "red" : "#1400a3";

    function closeContainer() {
        setTextBoxOpen(false);
    }

    return (
        <Container open={textBoxOpen}>
            <Close onClick={closeContainer} background_image={icon_close}></Close>
            <Flag>
                <path fill={flag_color} d={flag_path}></path>
            </Flag>
            <Kicker enterprise={enterprise}>{kicker}</Kicker>
            <TextHeader>{highlightObj["Name"]}</TextHeader>
            <P>Type: {highlightObj["Type"]}</P>
            <P>District: {highlightObj["District"]}</P>
            <P>Start year: {highlightObj["Start Year"]}</P>
            {highlightObj.Description &&
                <>
                    <FirstCharacter>{highlightObj.Description[0]}</FirstCharacter>
                    <P>{highlightObj.Description.slice(1)}</P>
                </>
            }
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    top: 0;
    right: ${({ open }) => open ? "0px" : "-300px"};
    margin-right: -20px;
    width: calc(300px - 50px);
    padding: 0px 20px 0px 30px;
    height: 100vh;
    background: #D3F0F7;
    color: #1400a3;
    border-left: 1px solid #1400a3;
    z-index: 7;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: right 1s ease;
`;

const Close = styled.button`
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    background-image: ${({ background_image }) => `url("${background_image}")`};
    background_size: cover;
    background-repeat: norepeat;
    background-color: transparent;
    border: none;
    :focus {
        outline: none;
    }
`;

const Flag = styled.svg`
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100vh;
    overflow: hidden;
`;

const Kicker = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 12px;
    padding-top: 60px;
    color: ${({ enterprise }) => enterprise ? "red" : "#1400a3"}
`;

const FirstCharacter = styled.span`
    float: left;
    font-family: etna;
    font-weight: 900;
    font-size: 60px;
    line-height: 50px;
    padding-right: 8px;
    padding-left: 3px;
`;

const TextHeader = styled.h1`
    font-size: 28px;
    font-weight: normal;
`;

const P = styled.p`
    font-size: 13px;
`;