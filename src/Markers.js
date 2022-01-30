import React, { useState } from "react";
import {  Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";


export function Markers( { locked_highlight_id, setLockedHighlightId } ) {

    return (
        <>
            {data.map((d, i)=>{
                return <MarkerPoint
                    key={i}
                    data={d}
                    locked_highlight_id={locked_highlight_id}
                    setLockedHighlightId={setLockedHighlightId}
                />;
            })}
        </>
    );
}



function MarkerPoint({ data , locked_highlight_id, setLockedHighlightId }){

    if (!data.Latitude || !data.Longitude ) return null;
    const is_locked_highlight = locked_highlight_id === data.id;
    return (
        <>
            <Marker
                latitude={data.Latitude}
                longitude={data.Longitude}
                anchor="center"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    willChange: "transform",
                }}
            >
                {is_locked_highlight ? <HighlightedMarker/> : <MarkerStyled
                    onClick={()=> setLockedHighlightId(data.id)}
                />}
            </Marker>
        </>
    );

}

const MarkerStyled = styled.div`
    background: blue;
    width: 2px;
    height: 10px;
    border: 1px solid coral;
    cursor: pointer;
`;
const HighlightedMarker = styled.div`
    background: red;
    width: 10px;
    height: 20px;
    border: 1px solid coral;
    cursor: pointer;
`;