import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";


export function Dropdown({ label, value, options, onSelect, is_mobile }) {
    const inactive_color = is_mobile ? null : "#FDC5FF";
    return (
        <Container>
            <Listbox value={value} onChange={onSelect}>
                <Label>{label}:</Label>
                <Button  className={
                    ({ open }) => (open ? "button_open" : "button_closed")
                }>{value}</Button>
                <Options>
                    {options.map(({ label, value }) => (
                        <Option value={value} key={value}>
                            {({ active }) => (
                                <span style={{ background: active ? null : inactive_color }}>
                                    {label}
                                </span>
                            )}
                        </Option>
                    ))}
                </Options>
            </Listbox>
        </Container>
    );
}
const Options = styled(Listbox.Options)`

    width: 100px;
    position: absolute;
    right: 0px;
    top: 100%;
    padding: 0px 0px!important;
    margin: 0px;
    list-style-type: none;
    background: inherit;
    box-sizing: border-box;
    :focus {
        outline: none;
    }
`;

const Option = styled(Listbox.Option)`
    width: 100%;
    text-align: center;
    background: inherit;
    box-sizing: border-box;
    border: 1px solid #1400a3;
    border-top: none;
    span {
        padding: 10px 0px;
        display: inline-block;
        box-sizing: border-box;
        line-height: normal;
        width: 100%;
        background:#FFD6FF;
    }

`;
const Label = styled(Listbox.Label)`
    width: 80px;
    display: inline-block;
`;

const Button = styled(Listbox.Button)`
    width: 100px;
    font-family: inherit;
    background: inherit;
    box-sizing: border-box;
    border: 1px solid #1400a3;
    cursor: pointer;
    color: inherit;
    :focus {
        outline: none;
    }
`;

const Container = styled.div`
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


`;