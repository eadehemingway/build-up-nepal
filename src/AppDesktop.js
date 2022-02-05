import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DesktopMap } from "./Map/DesktopMap.js";
import { DesktopStacks } from "./Stacks/DesktopStacks";
import { IconChart } from "./IconChart";
import { TextBox } from "./InfoOverlay";

export function Desktop({ highlight_id, setHighlightId, setHighlightLocked, highlight_locked, windowH, windowW }) {

    return (
        <>
            <IconChart
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                width={300}
                height={windowH - 10}
            />
            <DesktopMap
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                width={windowW - 300}
                height={windowH - 300}
                highlight_locked={highlight_locked}
            />

            <DesktopStacks
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                width={windowW - 300}
                height={300}
            />
            <TextBox
                highlight_locked={highlight_locked}
                highlight_id={highlight_id}
                setHighlightLocked={setHighlightLocked}
            />
        </>
    );
}