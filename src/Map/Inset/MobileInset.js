import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";
import { Dropdown } from "../../shared/Dropdown";
import { province_bounds } from "../../data/prov_bounds";
import { unzoomed_latlng } from "./DesktopInset";


export function Inset({ margin, zoomMapTo, zoomed_province, setZoomedProvince }) {

    const options = [
        { label: "All provinces", value: null },
        { label: "Province 1", value: 1 },
        { label: "Province 2", value: 2 },
        { label: "Province 3", value: 3 },
        { label: "Province 4", value: 4 },
        { label: "Province 5", value: 5 },
        { label: "Province 6", value: 6 },
        { label: "Province 7", value: 7 },
    ];

    function onSelect(val){
        if (val===null){
            zoomMapTo(unzoomed_latlng);
        }else {
            const lat_longs = province_bounds[val];
            zoomMapTo(lat_longs);
        }
        setZoomedProvince(val);
    }
    return (
        <Dropdown
            value={zoomed_province || options[0].value}
            options={options}
            onSelect={onSelect}
            options_width={135}
            label_width={0}
            margin={182}
            dropdown_position={"absolute"}
            dropdown_top={95}
        />
    );
}
