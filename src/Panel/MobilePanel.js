import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { data } from "../data/data";
import icon_arrow from "../assets/icon_arrow.svg";
import { PanelContent } from "./PanelContent";
import { dark_blue, turquoise } from "../shared/colors";

export function MobileTextBox( { panel_height, highlight_locked, highlight_id, setPanelOpen, panel_open } ) {
    const highlightObj = useMemo(() => data.find(d => d.id === highlight_id), [highlight_id]);

    function onClick(e){
        setPanelOpen(true);
        e.stopPropagation();
    }

    function collapse(e){
        setPanelOpen(false);
        e.stopPropagation();
    }

    return (
        <Container panel_height={panel_height} onClick={onClick} open={panel_open} bit_open={highlight_locked}>
            <Arrow onClick={collapse} no_mouse={panel_open} background_image={icon_arrow}></Arrow>
            {highlightObj && <PanelContent highlightObj={highlightObj}/>}
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    right: 0;
    top: ${({ open, bit_open, panel_height }) =>{
        if (open) return "20px";
        if (bit_open) return `${panel_height - 50}px`;
        return `${panel_height}px`;
    }};
    transition: top 1s ease;
    width: calc(100% - 70px);
    padding: 0px 20px 0px 30px;
    height: ${({ panel_height }) => panel_height}px;
    background: ${turquoise};
    color: ${dark_blue};
    border-left: 1px solid ${dark_blue};
    z-index: 7;
    overflow-y: scroll;
    overflow-x: hidden;

`;

const Arrow = styled.button`
    width: 30px;
    height: 30px;
    position: absolute;
    right: 30px;
    top: 10px;
    background-image: ${({ background_image }) => `url("${background_image}")`};
    background_size: cover;
    background-repeat: norepeat;
    background-color: transparent;
    border: none;
    cursor: pointer;
    pointer-events:${({ no_mouse }) => no_mouse ? "auto" : "none"};
    transform: scale(1, ${({ no_mouse }) => no_mouse ? "-1" : "1"});

    z-index: 3;
    :focus {
        outline: none;
    }
`;
