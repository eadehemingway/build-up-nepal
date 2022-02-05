import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MobileMap } from "./Map/MobileMap.js";
import { MobileStacks } from "./Stacks/MobileStacks";
import { MobileTextBox } from "./Panel/MobilePanel";

export function Mobile({ highlight_id, setHighlightId, setHighlightLocked, highlight_locked, windowH, windowW }) {


    return (
        <Container>
            <MobileMap
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                width={windowW}
                height={windowH /2}
                highlight_locked={highlight_locked}
            />

            <MobileStacks
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                width={windowW}
                height={400}
            />
            <MobileTextBox
                highlight_locked={highlight_locked}
                highlight_id={highlight_id}
                setHighlightLocked={setHighlightLocked}
            />
        </Container>
    );
}

const Container = styled.div`
    height: calc(100vh - 20px);
`;