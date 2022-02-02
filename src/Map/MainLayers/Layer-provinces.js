import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";



export function ProvincesLayer({ province_outline_visible }) {

    if (!province_outline_visible) return null;
    return (
        <Layer id="provinces-outline" source="provinces" type="line" paint={{ "line-width": 0.2, "line-color": "red" }}/>
    );
}

