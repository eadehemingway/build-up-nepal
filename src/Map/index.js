import React, { useEffect, useState , useRef, useMemo } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import { ContourLayer } from "./MainLayers/Layer-contour";
import { PopulationLayer } from "./MainLayers/Layer-population";
import { CountryOutlineLayer } from "./MainLayers/Layer-country-outline";
import { InsetMap, maxLat, maxLng, minLng, minLat } from "./Inset/index";
import { MarkerLayer } from "./MainLayers/Layer-makers";
import { data } from "../data/data";
import { TextBox } from "../InfoOverlay/TextBox";
import MAP_STYLE_MAIN from "./style-common";
import red_flag from "./../assets/red-flag.png";
import blue_flag from "./../assets/blue-flag.png";
import { LoadingScreen } from "../Loading/LoadingScreen";
import { MainLabelsLayer } from "./MainLayers/Layer-labels-nepal";
import { MainCitiesLayer } from "./MainLayers/Layer-labels-cities";
import { ProvincesLayer } from "./MainLayers/Layer-provinces";
import { ZoomedProvinceFill } from "./MainLayers/Layer-zoomed-prov-fill";
import { UnzoomedProvFill } from "./MainLayers/Layer-unzoomed-prov-fill";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


const half_lng = (maxLng - minLng) /2;
const half_lat = (maxLat - minLat) /2;
const center_lat = minLat + half_lat;
const center_lng = minLng + half_lng;

export function Map({ highlight_id, setHighlightId }) {
    const [contour_visible, setContourVisible] = useState(true);
    const [population_visible, setPopulationVisible] = useState(true);
    const [province_outline_visible, setProvinceOutlineVisible] = useState(true);
    const [country_outline_visible, setCountryOutlineVisible] = useState(true);
    const [markers_visible, setMarkerVisible] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [zoomed_province, setZoomedProvince] = useState(null);

    const $main_map = useRef();

    function zoomMapTo({ minLng, minLat, maxLng, maxLat }){
        if (!$main_map.current) return;
        $main_map.current.fitBounds(
            [
                [minLng, minLat],
                [maxLng, maxLat]
            ],
            { padding: 40, duration: 3500 }
        );
    }

    useEffect(()=>{
        if (!$main_map.current) return;
        $main_map.current.on("mouseenter", "markers-layer", (e) => {
            const feature = e.features[0];
            if (feature) {
                setHighlightId(feature.id);
            }
        });
        $main_map.current.on("mouseleave", "markers-layer", (e) => {
            setHighlightId(null);
        });

    }, [$main_map.current]);


    const highlight_obj = useMemo(()=>data.find(d=>  d.id === highlight_id), [highlight_id]);

    function handleLoaded (){
        setLoaded(true);

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
    };

    return (
        <>
            <button onClick={()=> setContourVisible((v)=> !v)}>contour toggle</button>
            <button onClick={()=> setPopulationVisible((v)=> !v)}>pop toggle</button>
            <button onClick={()=> setProvinceOutlineVisible((v)=> !v)}>province outline toggle</button>
            <button onClick={()=> setCountryOutlineVisible((v)=> !v)}>country outline toggle</button>
            <button onClick={()=> setMarkerVisible((v)=> !v)}>marker toggle</button>
            {/* <LoadingScreen loaded={loaded}/> */}
            <MapGL
                ref={$main_map}
                {...map_attributes}
                onLoad={handleLoaded}
            >
                <ZoomedProvinceFill zoomed_province={zoomed_province}/>
                <UnzoomedProvFill zoomed_province={zoomed_province}/>
                <ContourLayer contour_visible={contour_visible}/>
                <PopulationLayer population_visible={population_visible}/>
                <CountryOutlineLayer country_outline_visible={country_outline_visible}/>
                <MarkerLayer markers_visible={markers_visible} highlight_id={highlight_id}/>
                <ProvincesLayer province_outline_visible={province_outline_visible}/>
                <MainLabelsLayer/>
                <MainCitiesLayer/>
            </MapGL>
            <TextBox highlight_obj={highlight_obj}/>
            <InsetMap zoomMapTo={zoomMapTo} zoomed_province={zoomed_province} setZoomedProvince={setZoomedProvince}/>

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
        "top": 20,
        right: 0,
        left: 0,
        height: "calc(100vh - 300px)",
        overflow: "hidden",
        "zIndex": -1
    },
    initialViewState:{
        latitude:center_lat,
        longitude: center_lng,
        zoom: 6.2
    }
};

