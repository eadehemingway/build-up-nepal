import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DesktopMap } from "./Map/DesktopMap.js";
import { DesktopStacks } from "./Stacks/DesktopStacks";
import { IconChart } from "./IconChart";
import { TextBox } from "./Panel/DesktopPanel";
import page_title from "./assets/page_title.svg";

export function Desktop({ highlight_id, setHighlightId, setHighlightLocked, highlight_locked, windowH, windowW }) {
    function onClick(e){
        setHighlightLocked(false);
    }
    const icon_chart_width = 450;
    return (
        <div onClick={onClick}>
            <PageTitle l={40} w={icon_chart_width - 80} src={`${page_title}`}/>
            <IconChart
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                width={icon_chart_width}
                height={windowH - 10}
            />
            <DesktopMap
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                width={windowW - icon_chart_width}
                height={windowH - 340}
                highlight_locked={highlight_locked}
            />

            <DesktopStacks
                highlight_id={highlight_id}
                setHighlightId={setHighlightId}
                setHighlightLocked={setHighlightLocked}
                highlight_locked={highlight_locked}
                width={windowW - icon_chart_width}
                height={300}
            />
            <TextBox
                highlight_locked={highlight_locked}
                highlight_id={highlight_id}
                setHighlightLocked={setHighlightLocked}
            />
        </div>
    );
}

const PageTitle = styled.img`
    width: ${({ w }) => w}px;
    position: absolute;
    top: ${({ t }) => t || 0}px;
    left: ${({ l }) => l || 0}px;
`;