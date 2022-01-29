import React, { useState } from "react";
import MapGL, { Source, Layer, Marker } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { Map } from "./Map";
import { StackedBar } from "./StackedBar";


export function StackedBars() {
    const [data, setData] = useState([1, 2, 3]);



    return (
        <>
            <button onClick={()=> setData((v)=> [...v, 1])}>add to data</button>
            <button onClick={()=> setData((v)=> {
                const new_data = [...v];
                new_data.pop();
                return new_data;

            })}>remove from data</button>
            <StackedBar bar_data={data}/>
            <Svg id="shared-svg"/>
        </>

    );
}



const Svg = styled.svg`
width: 100%;
height: 300px;
border: 1px solid red;
position: absolute;
bottom: 0;
right: 0;

`;