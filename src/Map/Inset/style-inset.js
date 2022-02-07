
import MAP_STYLE from "../style-common.json";
import provinces from "../../data/provinces.json";
import { base_pink, dark_pink, dark_blue } from "../../shared/colors";


const fillLayer = {
    id: "provinces-fill",
    source: "provinces",
    type: "fill",
    paint: {
        "fill-outline-color": dark_blue,
        "fill-color": [
            "case",
            ["boolean", ["feature-state", "click"], false],
            dark_pink,
            ["boolean", ["feature-state", "hover"], false],
            dark_pink,
            base_pink,
        ],
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
