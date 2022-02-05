import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MobileMap } from "./Map/MobileMap.js";
import { StackedBars } from "./Stacks/index.js";
import { TextBox } from "./InfoOverlay";

export function Mobile({ highlight_id, setHighlightId, setHighlightLocked, highlight_locked, windowH, windowW }) {



    useEffect(() => {

    }, []);

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

            {/* <StackedBars
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                width={windowW - 300}
                height={300}
            /> */}
            {/* <TextBox
                highlight_locked={highlight_locked}
                highlight_id={highlight_id}
                setHighlightLocked={setHighlightLocked}
            /> */}
        </Container>
    );
}

const Container = styled.div`
    border: 1px solid blue;
    margin: 10px;
    height: calc(100vh - 20px);
`;