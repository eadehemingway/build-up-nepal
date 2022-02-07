import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { data } from "../data/data";
import icon_close from "../assets/icon_close.svg";
import { PanelContent } from "./PanelContent";
import { dark_blue, turquoise } from "../shared/colors";

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
        return open ? "0px" : "-302px";}};
    transition: right 1s ease;
    width: calc(300px - 50px);
    padding: 0px 20px 0px 30px;
    height: 100vh;
    background: ${turquoise};
    color: ${dark_blue};
    border-left: 1px solid ${dark_blue};
    z-index: 7;
    overflow-y: scroll;
    overflow-x: hidden;

`;

const Close = styled.button`
    width: 30px;
    height: 30px;
    position: absolute;
    right: 20px;
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
