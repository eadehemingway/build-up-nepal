import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { InsetLabelLayer } from "./Layer-labels-inset";
import zoom_out from "./../../assets/zoom-out.png";
import { insetMapStyle } from "./style-inset";
import bbox from "@turf/bbox";
import { red } from "../../shared/colors";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";
export const minLng = 80;
export const maxLng = 88.1;
export const maxLat = 30.6;
export const minLat = 26.3;
export const unzoomed_latlng = { minLng, maxLng, maxLat, minLat };

export function DesktopInset({ zoomMapTo, zoomed_province, setZoomedProvince }) {
    const [is_zoomed, setIsZoomed] = useState(false);
    const $inset_map = useRef();

    useEffect(()=>{
        if (!$inset_map.current) return;
        let hovered_state_id = null;
        let clicked_state_id = null;

        $inset_map.current.on("mouseenter", "provinces-fill", () => {
            $inset_map.current.getCanvas().style.cursor = "pointer";
        });

        $inset_map.current.on("mousemove", "provinces-fill", (e) => {
            if (e.features.length > 0) {
                if (hovered_state_id !== null) {
                    updateFeatState(hovered_state_id, { hover: false });
                }
                hovered_state_id = e.features[0].id;
                updateFeatState(hovered_state_id, { hover: true });
            }
        });

        $inset_map.current.on("click", "provinces-fill", (e) => {
            const feature = e.features[0];
            if (e.features.length > 0) {
                if (clicked_state_id !== null) {
                    updateFeatState(clicked_state_id, { click: false });
                }
                clicked_state_id = feature.id;
                setZoomedProvince(clicked_state_id);
                updateFeatState(clicked_state_id, { click: true });
            }

            if (feature){
                const [minLng, minLat, maxLng, maxLat] = bbox(feature);
                setIsZoomed(true);
                zoomMapTo({ minLng, minLat, maxLng, maxLat });
            }
        });

        $inset_map.current.on("mouseleave", "provinces-fill", () => {
            $inset_map.current.getCanvas().style.cursor = "";

            if (hovered_state_id !== null) {
                updateFeatState(hovered_state_id, { hover: false });
            }
            hovered_state_id = null;
        });
    });

    function updateFeatState(id, state){
        $inset_map.current.setFeatureState(
            { source: "provinces", id },
            state
        );
    }

    function unZoom (){
        setIsZoomed(false);
        zoomMapTo({ minLng, minLat, maxLng, maxLat });
        updateFeatState(zoomed_province, { click: false });
        setZoomedProvince(null);
    }

    return (
        <>
            <MapGL
                ref={$inset_map}
                {...map_attributes}
                style= {{
                    "position": "absolute",
                    "boxSizing": "border-box",
                    "top": 20,
                    right: 0,
                    height: "200px",
                    width: "300px",
                    overflow: "hidden",
                }}
            >
                {is_zoomed && <Button onClick={unZoom}></Button>}
                <Layer
                    id="provinces-outline"
                    source="provinces"
                    type="line"
                    paint={{ "line-width": 0.2, "line-color": red }}

                />
                <InsetLabelLayer/>

            </MapGL>
        </>

    );
}

const map_attributes = {
    mapStyle: insetMapStyle,
    interactiveLayerIds:["provinces-fill"],
    mapboxAccessToken:MAPBOX_TOKEN,
    scrollZoom:false,
    doubleClickZoom:false,
    dragPan:false,
    touchZoom:false,
    touchRotate:false,
    keyboard:false,
    initialViewState:{
        latitude: 28.0,
        longitude: 84.2,
        zoom: 4.6
    }
};


const Button = styled.button`
    position: absolute;
    cursor: pointer;
    outline: none;
    border: none;
    top: 10px;
    right: 10px;
    z-index: 2;
    background: none;
    background-image: url("${zoom_out}");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 35px;
    width: 35px;

`;