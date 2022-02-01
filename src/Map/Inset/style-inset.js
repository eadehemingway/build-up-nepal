
import MAP_STYLE from "../style-common.json";
import provinces from "../../data/mini_map_feat.json";


const fillLayer = {
    id: "provinces-fill",
    source: "provinces",
    type: "fill",
    paint: {
        "fill-outline-color": "red",
        "fill-color": [
            "case",
            ["boolean", ["feature-state", "click"], false],
            "red",
            "#FFAEFF"
        ],
        "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5
        ]
    },
};


// function geoCollectionToFeatureCollection(geoJson){
//     const geo_arr = geoJson.geometries;
//     const features_arr = geo_arr.map((obj, i)=> {
//         return {
//             type: "Feature",
//             geometry: {
//                 ...obj
//             },
//             properties: {
//             },
//             id: i
//         };
//     });
//     const json = {
//         type: "FeatureCollection",
//         features: features_arr
//     };
//     return json;
// }

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
