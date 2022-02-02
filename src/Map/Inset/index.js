import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { InsetLabelLayer } from "./Layer-labels-inset";
import zoom_out from "./../../assets/zoom-out.png";
import { insetMapStyle } from "./style-inset";
import bbox from "@turf/bbox";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";
export const minLng = 80;
export const maxLng = 88.1;
export const maxLat = 30.6;
export const minLat = 26.3;

export function InsetMap({ zoomMapTo  }) {
    const [is_zoomed, setIsZoomed] = useState(false);
    const $inset_map = useRef();
    const [clicked_id, setClickedId] = useState(null);

    useEffect(()=>{
        if (!$inset_map.current) return;
        let hoveredStateId = null;
        let clickedStateId = null;

        $inset_map.current.on("mouseenter", "provinces-fill", () => {
            $inset_map.current.getCanvas().style.cursor = "pointer";
        });


        $inset_map.current.on("mousemove", "provinces-fill", (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    updateFeatState(hoveredStateId, { hover: false });

                }
                hoveredStateId = e.features[0].id;
                updateFeatState(hoveredStateId, { hover: true });

            }
        });

        $inset_map.current.on("click", "provinces-fill", (e) => {
            const feature = e.features[0];
            if (e.features.length > 0) {
                if (clickedStateId !== null) {
                    updateFeatState(clickedStateId, { click: false });

                }
                clickedStateId = feature.id;
                setClickedId(clickedStateId);
                updateFeatState(clickedStateId, { click: true });

            }

            if (feature){
                const [minLng, minLat, maxLng, maxLat] = bbox(feature);
                setIsZoomed(true);
                zoomMapTo({ minLng, minLat, maxLng, maxLat });
            }
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        $inset_map.current.on("mouseleave", "provinces-fill", () => {
            $inset_map.current.getCanvas().style.cursor = "";

            if (hoveredStateId !== null) {
                updateFeatState(hoveredStateId, { hover: false });
            }
            hoveredStateId = null;
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
        updateFeatState(clicked_id, { click: false });

    }
    return (
        <>
            <MapGL
                ref={$inset_map}
                {...map_attributes}
                style= {{
                    "position": "absolute",
                    "border": "1px solid blue",
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
                    paint={{ "line-width": 0.2, "line-color": "red" }}

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