import React, { useEffect, useState , useRef, useMemo } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import bbox from "@turf/bbox";
import { ContourLayer } from "./ContourLayer";
import { PopulationLayer } from "./PopulationLayer";
import { CountryOutlineLayer } from "./CountryOutlineLayer";
import { InsetMap } from "./InsetMap";
import { MarkerLayer } from "./MarkerLayer";
import { data } from "../data/data";
import { TextBox } from "../InfoOverlay/TextBox";
import { MAP_STYLE_MAIN } from "./main_map_style";
import zoom_out from "./../assets/zoom-out.png";
import flag from "./../assets/flag-01.png";
import { LoadingScreen } from "../Loading/LoadingScreen";


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWFkZWhlbSIsImEiOiJja3l5a3FidWQwZzdiMnB1b2J3MXVyZzJ2In0.0Yy04h5WZ1O7wYDGkwSXiQ";


const minLng = 80;
const maxLng = 88.1;
const maxLat = 30.6;
const minLat = 26.3;

const half_lng = (maxLng - minLng) /2;
const half_lat = (maxLat - minLat) /2;
const center_lat = minLat + half_lat;
const center_lng = minLng + half_lng;

export function Map({ highlight_id, setHighlightId }) {
    const [contour_visible, setContourVisible] = useState(false);
    const [population_visible, setPopulationVisible] = useState(true);
    const [province_outline_visible, setProvinceOutlineVisible] = useState(true);
    const [country_outline_visible, setCountryOutlineVisible] = useState(true);
    const [markers_visible, setMarkerVisible] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [is_zoomed, setIsZoomed] = useState(false);
    const mapRef = useRef();


    const onClickInsetMap = (event) => {
        if (!mapRef.current) return;
        const feature = event.features[0];
        if (feature) {
            // calculate the bounding box of the feature
            const [minLng, minLat, maxLng, maxLat] = bbox(feature);
            setIsZoomed(true);
            mapRef.current.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat]
                ],
                { padding: 40, duration: 3500 }
            );
        }
    };

    useEffect(()=>{
        if (!mapRef.current) return;
        mapRef.current.on("mouseenter", "markers-layer", (e) => {
            mapRef.current.getCanvas().style.cursor = "pointer";
            const feature = e.features[0];
            if (feature) {
                setHighlightId(feature.id);
            }
        });
        mapRef.current.on("mouseleave", "markers-layer", (e) => {
            mapRef.current.getCanvas().style.cursor = "";
            setHighlightId(null);
        });

    }, [mapRef.current]);


    function unZoom(){
        if (!mapRef.current) return;
        setIsZoomed(false);
        mapRef.current.fitBounds([
            [minLng, minLat],
            [maxLng, maxLat]
        ],
        { padding: 40, duration: 3500 }
        );
    }

    const highlight_obj = useMemo(()=>{
        const obj = data.find(d=>  d.id === highlight_id);
        return obj;

    }, [highlight_id]);

    function handleLoaded (){
        setLoaded(true);
        mapRef.current.loadImage(
            flag,
            (error, image) => {
                if (error) throw error;
                mapRef.current.addImage("custom-marker", image);
            })
        ;}
    return (
        <>
            <button onClick={()=> setContourVisible((v)=> !v)}>contour toggle</button>
            <button onClick={()=> setPopulationVisible((v)=> !v)}>pop toggle</button>
            <button onClick={()=> setProvinceOutlineVisible((v)=> !v)}>province outline toggle</button>
            <button onClick={()=> setCountryOutlineVisible((v)=> !v)}>country outline toggle</button>
            <button onClick={()=> setMarkerVisible((v)=> !v)}>marker toggle</button>
            {is_zoomed && <Button onClick={unZoom}></Button>}
            <LoadingScreen loaded={loaded}/>
            <MapGL
                ref={mapRef}
                {...map_attributes}
                onLoad={handleLoaded}
            >
                <ContourLayer contour_visible={contour_visible}/>
                <PopulationLayer population_visible={population_visible}/>
                <CountryOutlineLayer country_outline_visible={country_outline_visible}/>
                <MarkerLayer markers_visible={markers_visible} highlight_id={highlight_id}/>
                {province_outline_visible && <Layer id="provinces-outline" source="provinces" type="line" paint={{ "line-width": 0.2, "line-color": "red" }}/>}
            </MapGL>
            <TextBox highlight_obj={highlight_obj}/>
            <InsetMap onClick={onClickInsetMap}/>

        </>

    );
}
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
        overflow: "hidden"
    },
    initialViewState:{
        latitude:center_lat,
        longitude: center_lng,
        zoom: 6.2
    }
};

