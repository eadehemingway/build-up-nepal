import React, { useEffect, useState , useRef, useMemo } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { ContourLayer } from "./MainLayers/Layer-contour";
import { PopulationLayer } from "./MainLayers/Layer-population";
import { CountryOutlineLayer } from "./MainLayers/Layer-country-outline";
import { InsetMap, maxLat, maxLng, minLng, minLat } from "./Inset/DesktopInset";
import { MarkerLayer } from "./MainLayers/Layer-markers";
import { data } from "../data/data";
import MAP_STYLE_MAIN from "./style-common";
import red_flag from "./../assets/red-flag.png";
import blue_flag from "./../assets/blue-flag.png";
import location_marker from "./../assets/location-marker.png";
import { LoadingScreen } from "../Loading";
import { MainLabelsLayer } from "./MainLayers/Layer-labels-nepal";
import { MainCitiesLayer } from "./MainLayers/Layer-labels-cities";
import { ProvincesLayer } from "./MainLayers/Layer-provinces";
import { ZoomedProvinceFill } from "./MainLayers/Layer-zoomed-prov-fill";
import { UnzoomedProvFill } from "./MainLayers/Layer-unzoomed-prov-fill";
import { Inset } from "./Inset/MobileInset";
import { unzoomed_latlng } from "./Inset/DesktopInset";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


const half_lng = (maxLng - minLng) /2;
const half_lat = (maxLat - minLat) /2;
const center_lat = minLat + half_lat;
const center_lng = minLng + half_lng;

export function MobileMap({ margin, highlight_id, setHighlightId, setHighlightLocked, width, height, highlight_locked }) {
    const [markers_visible, setMarkerVisible] = useState(true);
    const [map_loaded, setMapLoaded] = useState(false);
    const [zoomed_province, setZoomedProvince] = useState(null);

    const $main_map = useRef();

    function zoomMapTo({ minLng, minLat, maxLng, maxLat }, duration){
        if (!$main_map.current) return;
        const dur = duration === undefined ? 3500 : duration;
        $main_map.current.fitBounds(
            [
                [minLng, minLat],
                [maxLng, maxLat]
            ],
            { padding: 20, duration: dur }
        );
    }

    useEffect(()=>{
        if(map_loaded) {
            zoomMapTo(unzoomed_latlng, 0);
        }
    }, [map_loaded]);

    function handleOnClick (e){
        e.originalEvent.cancelBubble = true;
        if (!$main_map.current) return;
        const feature = e.features[0];
        if (feature) {
            setHighlightLocked(true);
            setHighlightId(feature.id);
        }
    }


    function handleLoaded (){
        setMapLoaded(true);

        $main_map.current.loadImage(
            blue_flag,
            (error, image) => {
                if (error) throw error;
                $main_map.current.addImage("one-off", image);
            });
        $main_map.current.loadImage(
            red_flag,
            (error, image) => {
                if (error) throw error;
                $main_map.current.addImage("enterprise", image);
            });
        $main_map.current.loadImage(
            location_marker,
            (error, image) => {
                if (error) throw error;
                $main_map.current.addImage("location_marker", image);
            });
    };

    return (
        <>
            <button style={{ display: "none" }} onClick={()=> setMarkerVisible((v)=> !v)}>marker toggle</button>
            <LoadingScreen loaded={map_loaded}/>
            <Inset
                zoomMapTo={zoomMapTo}
                zoomed_province={zoomed_province}
                setZoomedProvince={setZoomedProvince}
                margin={margin}
            />
            <MapGL
                ref={$main_map}
                {...map_attributes}
                onLoad={handleLoaded}
                onClick={handleOnClick}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    margin: `40px ${margin}px`,
                    padding: "0px",
                    position: "absolute",
                    top: "95px",
                }}
                initialViewState={{
                    latitude:center_lat,
                    longitude: center_lng,
                    zoom:  width < 350 ? 4.5 : 4.9
                }}
            >
                <ZoomedProvinceFill zoomed_province={zoomed_province}/>
                <UnzoomedProvFill zoomed_province={zoomed_province}/>
                {/* <ContourLayer contour_visible={true}/> */}
                <PopulationLayer population_visible={true}/>
                <CountryOutlineLayer country_outline_visible={true}/>
                <ProvincesLayer province_outline_visible={true}/>
                <MarkerLayer markers_visible={markers_visible} highlight_id={highlight_id}/>
                <MainLabelsLayer/>
            </MapGL>

        </>

    );
}

const map_attributes = {
    mapStyle:MAP_STYLE_MAIN,
    interactiveLayerIds:["markers-layer"],
    mapboxAccessToken:MAPBOX_TOKEN,
    scrollZoom:false,
    doubleClickZoom:false,
    dragPan:false,
    touchZoom:false,
    touchRotate:false,
    keyboard:false,
    style:{
        "position": "absolute",
        "boxSizing": "border-box",
        "top": 40,
        right: 0,
        left: 0,
        height: "900px",
        overflow: "hidden",
        cursor: "pointer",
        "outline": "none"
    },

};

