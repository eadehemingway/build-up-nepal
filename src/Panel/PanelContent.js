import React, { useState, useMemo } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { data } from "../data/data";
import icon_close from "../assets/icon_close.svg";
import { dark_blue, red } from "../shared/colors";


export function PanelContent( { highlightObj } ) {

    const enterprise = highlightObj["flag-status"] === "enterprise";
    const kicker = enterprise ? "Enterprise" : "One-off";
    const flag_path = enterprise ? "M 0 0 L 22.5 0 L 11.333 7.5 L 22.5 16.25 L 0 16.25 Z" : "M 0 0 L 22.5 7.5 L 0 13.7 Z";
    const flag_color = enterprise ? red : dark_blue;


    return (
        <>
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
        </>
    );
}

const Flag = styled.svg`
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100px;
    overflow: hidden;
`;

const Kicker = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 12px;
    padding-top: 60px;
    color: ${({ enterprise }) => enterprise ? red : dark_blue}
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