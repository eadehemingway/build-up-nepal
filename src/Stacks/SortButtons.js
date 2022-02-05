import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";
import { Dropdown } from "../shared/Dropdown";

export function SortButtons({ sort_by, setSortBy }) {

    const options = [
        { label: "Year", value: "year" },
        { label: "Value", value: "metric" },
        { label: "Province", value: "province" }
    ];
    return (
        <Dropdown
            label={"Sort by"}
            value={sort_by}
            options={options}
            onSelect={setSortBy}
        />
    );
}
