import React, { useEffect, useState , useRef } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import "./App.css";
import { nepal_outline } from "./data/nepal_outline";
import { data } from "./data/data";
import { Markers } from "./Markers";
import province_outlines from "./data/province_outlines.json";
import { MapStyle } from "./Map-style";
import bbox from "@turf/bbox";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


export function Map() {
    const mapRef = useRef();
    const onClick = (event) => {
        if (!mapRef.current) return;
        const feature = event.features[0];
        if (feature) {
            // calculate the bounding box of the feature
            const [minLng, minLat, maxLng, maxLat] = bbox(feature);
            mapRef.current.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat]
                ],
                { padding: 40, duration: 3500 }
            );
        }
    };

    return (
        <>
            <MapGL
                ref={mapRef}
                initialViewState={{
                    latitude: 28.767,
                    longitude: 85.251,
                    zoom: 6.1
                }}
                width="100vw"
                height="100vh"
                style= {{ "position": "absolute", "border": "5px solid red", "boxSizing": "border-box" }}
                mapStyle={MapStyle}
                interactiveLayerIds={["provinces-fill"]}
                onClick={onClick}
                mapboxAccessToken={MAPBOX_TOKEN}
                scrollZoom={false}
            >
                <Source id="contour_source" type="raster" url={"mapbox://eadehem.9bmo07eb"} tileSize={256}>
                    <Layer
                        id="contour_layer"
                        type="raster"
                        source="contour_source"
                        paint={{ "raster-contrast": 1 , "raster-opacity": 1 }}
                    />
                </Source>
                <Source id="population_source" type="raster" url={"mapbox://eadehem.5a0w2g3f"} tileSize={256}>
                    <Layer
                        id="population_layer"
                        type="raster"
                        source="population_source"
                        paint={{ "raster-contrast": 1 , "raster-opacity": 1 }}
                    />
                </Source>
                {/* <Markers markers_visible={true}/> */}

            </MapGL>
        </>

    );
}

