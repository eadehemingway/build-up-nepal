
import MAP_STYLE from "./style.json";
import provinces from "./data/mini_map.json";


const fillLayer = {
    id: "provinces-fill",
    source: "provinces",
    type: "fill",
    paint: {
        "fill-outline-color": "red",
        "fill-color": "#fff1E0",
        "fill-opacity": 1
    },
};

// const lineLayer = {
//     id: "provinces-outline",
//     source: "provinces",
//     type: "line",
//     paint: {
//         "line-width": 0.2,
//         "line-color": "red"
//     }
// };

// Make a copy of the map style
export const insetMapStyle = {
    ...MAP_STYLE,
    sources: {
        ...MAP_STYLE.sources,
        "provinces": {
            type: "geojson",
            data: provinces
        }
    },
    layers: [
        fillLayer,
        // lineLayer
    ]
};
