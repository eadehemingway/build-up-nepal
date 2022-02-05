import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";


export function SortButtons({ sort_by, setSortBy }) {
    const [sort_by_name, setSortByName] = useState("Year");

    const types = [
        { name: "Year", value: "year", key: 0 },
        { name: "Value", value: "metric", key: 1 },
        { name: "Province", value: "province", key: 2 }
    ];

    useEffect(() => {
        const name = types.filter(t => t.value === sort_by)[0].name;
        setSortByName(name);
    }, [sort_by]);

    return (
        <Dropdown>
            <Listbox value={sort_by} onChange={setSortBy}>
                <Listbox.Label>Sort by:</Listbox.Label>
                <Listbox.Button style={{ width: "100px", padding: "10px 0" }} className={
                    ({ open }) => (open ? "button_open" : "button_closed")
                }>{sort_by_name}</Listbox.Button>
                <Listbox.Options style={{ width: "100px", padding: "10px 0" }}>
                    {types.map((type) => (
                        <Listbox.Option value={type.value} key={type.key}>
                            {({ active }) => (
                                <span className={`${ active ? "active" : "inactive" }`}>
                                    {type.name}
                                </span>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </Dropdown>
    );
}

const Dropdown = styled.div`
    display: inline-block;
    font-size: 13px;
    width: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: visible;
    z-index: 4;
    background: #FFD6FF;
    color: #1400a3;

    label {
        width: 80px;
        display: inline-block;
    }

    button {
        width: 100px;
        font-family: inherit;
        background: inherit;
        box-sizing: border-box;
        border: 1px solid #1400a3;
        cursor: pointer;
        color: inherit;
    }

    button:focus {
        outline: none;
    }

    .button_open:after {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 3px 5.2px 3px;
        border-color: transparent transparent #1400a3 transparent;
        right: 10px;
        top: 17px;
        position: absolute;
    }

    .button_closed:after {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5.2px 3px 0 3px;
        border-color: #1400a3 transparent transparent transparent;
        right: 10px;
        top: 17px;
        position: absolute;
    }

    ul {
        width: 100px;
        position: absolute;
        right: 0px;
        top: 100%;
        padding: 0px 0px!important;
        margin: 0px;
        list-style-type: none;
        background: inherit;
        box-sizing: border-box;
    }

    ul:focus {
        outline: none;
    }

    li {
        width: 100%;
        text-align: center;
        background: inherit;
        box-sizing: border-box;
        border: 1px solid #1400a3;
        border-top: none;
    }

    span {
        padding: 10px 0px;
        display: inline-block;
        box-sizing: border-box;
        line-height: normal;
        width: 100%;
        background:#FFD6FF;
    }

    .active {
        background: #FDC5FF;
    }
`;