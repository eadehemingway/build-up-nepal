import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MobileMap } from "./Map/MobileMap.js";
import { MobileStacks } from "./Stacks/MobileStacks";
import { MobileTextBox } from "./Panel/MobilePanel";

export function Mobile({ highlight_id, setHighlightId, setHighlightLocked, highlight_locked, windowH, windowW }) {
    const [panel_open, setPanelOpen] = useState(false);

    function clickOut(){
        console.log("CLICKOUT");
        setPanelOpen(false);
        setHighlightId(null);
        setHighlightLocked(null);
    }

    let margin = 20;
    let padded_width = windowW - (margin * 2);
    let padded_height = windowH - (margin * 2);
    let dropdown_height = 49;

    return (
        <Container margin={margin} onClick={clickOut}>
            <MobileMap
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                width={padded_width}
                height={(padded_width) + dropdown_height}
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
                height={padded_height - (padded_width + dropdown_height + 50)}
            />
            <MobileTextBox
                style={{ marginLeft: `-${margin}px` }}
                highlight_locked={highlight_locked}
                highlight_id={highlight_id}
                panel_open={panel_open}
                setPanelOpen={setPanelOpen}
                setHighlightLocked={setHighlightLocked}
                panel_height={padded_height + margin}
            />
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: calc(100vh - ${({ margin }) => margin * 2}px);
    margin: ${({ margin }) => margin}px 0px;
    position: relative;
`;