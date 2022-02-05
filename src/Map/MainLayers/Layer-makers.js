import React, { useState } from "react";
import MapGL, { Source, Layer, Marker, LinearInterpolator } from "react-map-gl";
import styled from "styled-components";
import markers_geojson from "../../data/markers_with_flags.json";

export function MarkerLayer( { markers_visible, highlight_id } ) {

    const highlight_id_or_str = highlight_id || "";
    return (
        <>
            <Source id="marker-source" type="geojson" data={markers_geojson} promoteId={"id"}>
                {markers_visible && <>


                    <Layer
                        id="flag-layer"
                        type="symbol"
                        layout={{ "icon-image": ["get", "project_type"], "icon-size": 0.6, "icon-anchor": "bottom-left",   "icon-allow-overlap": true, }}
                        source="marker-source"
                        filter={["==", ["get", "id"], highlight_id_or_str]}
                    />
                    <Layer
                        id="markers-layer"
                        type="circle"
                        // type="symbol"
                        // layout={{ "icon-image": "custom-marker", "icon-size": 0.05 }}
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
                </>
                }

            </Source>
        </>
    );
}

