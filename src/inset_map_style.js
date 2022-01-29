
import MAP_STYLE from "./style.json";
import provinces from "./data/mini_map_feat.json";


const fillLayer = {
    id: "provinces-fill",
    source: "provinces",
    type: "fill",
    paint: {
        "fill-outline-color": "red",
        "fill-color": "red",
        "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5
        ]
    },
};


function geoCollectionToFeatureCollection(geoJson){
    const geo_arr = geoJson.geometries;
    const features_arr = geo_arr.map((obj, i)=> {
        return {
            type: "Feature",
            geometry: {
                ...obj
            },
            properties: {
            },
            id: i
        };
    });
    const json = {
        type: "FeatureCollection",
        features: features_arr
    };
    return json;
}


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
