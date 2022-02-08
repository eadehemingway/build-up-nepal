import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MobileMap } from "./Map/MobileMap.js";
import { MobileStacks } from "./Stacks/MobileStacks";
import { MobileTextBox } from "./Panel/MobilePanel";
import page_title from "./assets/page_title.svg";

export function Mobile({ highlight_id, setHighlightId, setHighlightLocked, highlight_locked, windowH, windowW }) {
    const [panel_open, setPanelOpen] = useState(false);

    function clickOut(){
        setPanelOpen(false);
        setHighlightId(null);
        setHighlightLocked(null);
    }

    let margin = 20;
    let padded_width = windowW - (margin * 2);

    return (
        <Container margin={margin} onClick={clickOut}>
            <PageTitle w={200} l={120} src={`${page_title}`}/>
            <MobileMap
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                width={padded_width}
                height={padded_width - 20}
                margin={margin}
                highlight_locked={highlight_locked}
            />
            <MobileStacks
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                margin={margin}
                width={windowW}
                height={windowH - ((padded_width - 20) + 95 + 60)}
            />
            <MobileTextBox
                highlight_locked={highlight_locked}
                highlight_id={highlight_id}
                panel_open={panel_open}
                setPanelOpen={setPanelOpen}
                setHighlightLocked={setHighlightLocked}
                panel_height={windowH}
            />
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    margin: 0px 0px;
    position: relative;
`;

const PageTitle = styled.img`
    width: ${({ w }) => w}px;
    position: absolute;
    z-index: 4;
    top: ${({ t }) => t || 0}px;
    left: 20px;
`;