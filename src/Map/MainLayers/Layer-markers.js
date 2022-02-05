import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import markers_geojson from "../../data/markers_with_flags.json";

export function MarkerLayer( { markers_visible, highlight_id } ) {

    const highlight_id_or_str = highlight_id || "";
    return (
        <>
            <Source id="marker-source" type="geojson" data={markers_geojson} promoteId={"id"}>
                {markers_visible && <>
                    <Layer
                        id="markers-layer"
                        type="circle"
                        source="marker-source"
                        paint = {{ "circle-stroke-width": 0.5,
                            "circle-color": [
                                "match",
                                ["get", "id"], highlight_id_or_str,
                                [
                                    "case",
                                    ["==", ["get", "project_type"], "enterprise"],
                                    "red",
                                    "#1400a3"
                                ],
                                "#FDC0FF"
                            ],
                            "circle-stroke-color": [
                                "case",
                                ["==", ["get", "project_type"], "enterprise"],
                                "red",
                                "#1400a3"
                            ],
                            "circle-radius": 3
                        }}
                    />
                    <Layer
                        id="flag-layer"
                        type="symbol"
                        layout={{
                            "icon-image": ["get", "project_type"],
                            "icon-size": 0.5,
                            "icon-anchor": "bottom-left",
                            "icon-allow-overlap": true,
                            "text-allow-overlap": true,
                            "icon-ignore-placement": true,
                            "text-ignore-placement": true
                        }}
                        source="marker-source"
                        filter={["==", ["get", "id"], highlight_id_or_str]}
                    />
                </>
                }

            </Source>
        </>
    );
}

