import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";
import { Dropdown } from "../shared/Dropdown";

export function SortDropdown({ margin, sort_by, setSortBy, label_width }) {

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
            margin={margin}
            label_width={label_width}
        />
    );
}
