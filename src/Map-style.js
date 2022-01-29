import type { GeoJSONSourceRaw, FillLayer, LineLayer } from "react-map-gl";

import MAP_STYLE from "./style.json";
import districs from "./data/province_outlines.json";


const fillLayer = {
    id: "provinces-fill",
    source: "provinces",
    type: "fill",
    paint: {
        "fill-outline-color": "red",
        "fill-color": "#fff",
        "fill-opacity": 0
    }
};

const lineLayer = {
    id: "provinces-outline",
    source: "provinces",
    type: "line",
    paint: {
        "line-width": 0.2,
        "line-color": "red"
    }
};

// Make a copy of the map style
export const MapStyle = {
    ...MAP_STYLE,
    sources: {
        ...MAP_STYLE.sources,
        "provinces": {
            type: "geojson",
            data: districs
        }
    },
    layers: [fillLayer, lineLayer]
};
