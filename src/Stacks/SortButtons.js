import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";
import { Dropdown } from "../shared/Dropdown";

export function SortButtons({ sort_by, setSortBy }) {

    const types = [
        { name: "Year", value: "year", key: 0 },
        { name: "Value", value: "metric", key: 1 },
        { name: "Province", value: "province", key: 2 }
    ];

    // useEffect(() => {
    //     const name = types.filter(t => t.value === sort_by)[0].name;
    //     // setSortByName(name);
    // }, [sort_by]);

    return (
        <Dropdown
            label={"Sort by"}
            value={sort_by}
            options={["Year", "Value", "Province"]}
            onSelect={setSortBy}
        />
    );
}
