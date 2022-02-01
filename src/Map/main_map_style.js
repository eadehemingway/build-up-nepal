
import MAP_STYLE from "./style.json";
import provinces from "../data/mini_map_feat.json";

// export const MAP_STYLE_MAIN =  {
//     ...MAP_STYLE,
//     sources: {
//         ...MAP_STYLE.sources,
//         "provinces": {
//             type: "geojson",
//             data: provinces
//         }
//     },
//     layers: [
//         {
//             id: "provinces-fill-main",
//             source: "provinces",
//             type: "fill",
//             paint: {
//                 "fill-color": "#d3f0f7"
//             }
//         }, ...MAP_STYLE.layers,
//     ]

// };

export const MAP_STYLE_MAIN = {
    "version": 8,
    "name": "nepal main labels",
    "metadata": {
        "mapbox:autocomposite": true,
        "mapbox:type": "template",
        "mapbox:sdk-support": {
            "android": "10.0.0",
            "ios": "10.0.0",
            "js": "2.6.0"
        },
        "mapbox:groups": {},
        "mapbox:uiParadigm": "layers"
    },
    "center": [83.0799115187466, 29.4806722737042],
    "zoom": 13.675079649770376,
    "bearing": 0,
    "pitch": 0,
    "sources": {
        "composite": {
            "url": "mapbox://eadehem.ckz3b9tq1028q27qvaeg5rnn8-6lpph",
            "type": "vector"
        }, "provinces": {
            type: "geojson",
            data: provinces
        }
    },
    "sprite": "mapbox://sprites/eadehem/ckz3buhkh000b14parfgbfn2z/ck2u8j60r58fu0sgyxrigm3cu",
    "glyphs": "mapbox://fonts/eadehem/{fontstack}/{range}.pbf",
    "layers": [
        {
            id: "provinces-fill-main",
            source: "provinces",
            type: "fill",
            paint: {
                "fill-color": "#d3f0f7"
            }
        },
        {
            "id": "nepal-main-labels",
            "type": "symbol",
            "source": "composite",
            "source-layer": "nepal_main_labels",
            "layout": {
                "text-field": "NEPAL",
                "text-font": ["Etna Black", "Arial Unicode MS Regular"],
                "text-letter-spacing": 1,
                "text-max-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    10,
                    22,
                    10
                ],
                "text-allow-overlap": false,
                "symbol-avoid-edges": true,
                "text-padding": 0,
                "text-ignore-placement": true
            },
            "paint": { "text-color": "hsl(247, 90%, 39%)" }
        }
    ],
    "created": "2022-01-31T23:32:40.454Z",
    "modified": "2022-02-01T00:20:13.834Z",
    "id": "ckz3buhkh000b14parfgbfn2z",
    "owner": "eadehem",
    "visibility": "private",
    "protected": false,
    "draft": false
};