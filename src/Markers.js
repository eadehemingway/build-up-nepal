import React, { useState } from "react";
import {  Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";


export function Markers( { highlighted_id, setHighlightedId } ) {

    return (
        <>
            {data.map((d, i)=>{
                return <MarkerPoint highlighted_id={highlighted_id} key={i} data={d} setHighlightedId={setHighlightedId}/>;
            })}
        </>
    );
}



function MarkerPoint({ data , highlighted_id, setHighlightedId }){

    if (!data.Latitude || !data.Longitude ) return null;
    const is_highlighted = highlighted_id === data.id;
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
                <MarkerStyled
                    style={{ backgroundColor : is_highlighted ? "red": "blue" }}
                    onClick={()=> setHighlightedId(data.id)}
                />
            </Marker>
        </>
    );

}

const MarkerStyled = styled.div`
    border-radius: 50%;
    background: red;
    width: 10px;
    height: 10px;
    border: 1px solid coral;
`;