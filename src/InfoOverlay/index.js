import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { data } from "../data/data";
import icon_close from "../assets/icon_close.svg";
import { PanelContent } from "./PanelContent";

export function TextBox( { setHighlightLocked, highlight_locked, highlight_id } ) {

    const highlightObj = useMemo(() => data.find(d => d.id === highlight_id), [highlight_id]);

    function closeContainer() {
        setHighlightLocked(false);
    }

    return (
        <Container open={highlight_locked}>
            <Close onClick={closeContainer} background_image={icon_close}></Close>
            {highlightObj && <PanelContent highlightObj={highlightObj}/>}
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    top: 0;
    right: ${({ open }) =>{
        return open ? "0px" : "-300px";}};
    transition: right 1s ease;
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

`;

const Close = styled.button`
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

    z-index: 3;
    :focus {
        outline: none;
    }
`;
