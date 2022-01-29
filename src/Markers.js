import React, { useState } from "react";
import {  Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { data } from "./data/data";


export function Markers( ) {

    return (
        <>
            {data.map((d, i)=>{
                return <MarkerPoint key={i} data={d}/>;
            })}
        </>
    );
}



function MarkerPoint({ data  }){
    if (!data.Latitude || !data.Longitude ) return null;
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
                <MarkerStyled onMouseOver={()=> console.log(data.Description)}/>
            </Marker>
        </>
    );

}

const MarkerStyled = styled.div`
    border-radius: 50%;
    background: red;
    width: 2px;
    height: 2px;
    border: 1px solid coral;
`;