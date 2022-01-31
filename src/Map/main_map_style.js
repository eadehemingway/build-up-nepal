
import MAP_STYLE from "./style.json";
import provinces from "../data/mini_map_feat.json";

export const MAP_STYLE_MAIN =  {
    ...MAP_STYLE,
    sources: {
        ...MAP_STYLE.sources,
        "provinces": {
            type: "geojson",
            data: provinces
        }
    },
    layers: [
        {
            id: "provinces-fill-main",
            source: "provinces",
            type: "fill",
            paint: {
                "fill-color": "#d3f0f7"
            }
        }
    ]

};