import React, { useState } from "react";
import {  Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";


export function Markers( { highlight_id, setHighlightId } ) {

    return (
        <>
            {data.map((d, i)=>{
                return <MarkerPoint highlight_id={highlight_id} key={i} data={d} setHighlightId={setHighlightId}/>;
            })}
        </>
    );
}



function MarkerPoint({ data , highlight_id, setHighlightId }){

    if (!data.Latitude || !data.Longitude ) return null;
    const is_highlighted = highlight_id === data.id;
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
                {is_highlighted ? <HighlightedMarker/> : <MarkerStyled
                    onClick={()=> setHighlightId(data.id)}
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