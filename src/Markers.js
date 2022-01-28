import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";


export function Markers({ markers_visible }) {

    return (
        <>
            {data.map((d, i)=>{
                return <MarkerPoint key={i} data={d} markers_visible={markers_visible}/>;
            })}
        </>
    );
}



function MarkerPoint({ data , markers_visible }){
    if (!data.Latitude || !data.Longitude || !markers_visible ) return null;
    return (
        <>
            <Marker latitude={data.Latitude} longitude={data.Longitude}>
                <MarkerStyled onMouseOver={()=> console.log(data.Description)}/>
            </Marker>
        </>
    );

}

const MarkerStyled = styled.div`
    border-radius: 50%;
    width: 1px;
    height: 1px;
    border: 1px solid coral;
`;