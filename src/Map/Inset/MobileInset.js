import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";
import { Dropdown } from "../../shared/Dropdown";
import { province_bounds } from "../../data/prov_bounds";
import { unzoomed_latlng } from "./DesktopInset";


export function Inset({ zoomMapTo, zoomed_province, setZoomedProvince }) {

    const options = [
        { label: "All", value: null },
        { label: "One", value: 1 },
        { label: "Two", value: 2 },
        { label: "Three", value: 3 },
        { label: "Four", value: 4 },
        { label: "Five", value: 5 },
        { label: "Six", value: 6 },
        { label: "Seven", value: 7 },
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
            label={"Projects in"}
            value={zoomed_province || options[0].value}
            options={options}
            onSelect={onSelect}
        />

    );
}
