import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";


export function Markers() {

    return (
        <>
            {data.map((d, i)=>{
                return <MarkerPoint key={i} data={d}/>;
            })}
        </>
    );
}



function MarkerPoint({ data }){
    if (!data.Latitude || !data.Longitude ) return null;
    return (
        <>
            <Marker latitude={data.Latitude} longitude={data.Longitude}>
                <MarkerStyled/>
            </Marker>
        </>
    );

}

const MarkerStyled = styled.div`
border-radius: 50%;
width: 2px;
height: 2px;
border: 1px solid coral;
`;