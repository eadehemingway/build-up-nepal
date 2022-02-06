import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";
import { base_pink, dark_blue, dark_pink } from "./colors";

export function Dropdown({ margin, label_width, options_width, label, value, options, onSelect, is_mobile }) {
    const [buttonLabel, setButtonLabel] = useState(options[0].label);
    function getLabelFromValue(){
        const l = options.find(o => o.value === value );
        setButtonLabel(l?.label);
    }
    useEffect(()=>{
        getLabelFromValue();
    }, [value]);

    const label_w = label_width || 100;
    const options_w = options_width || 100;
    const dropdown_w = label_w + options_w;
    const margin_left = margin || 0;

    return (
        <Container w={dropdown_w} margin_left={margin_left}>
            <Listbox value={value} onChange={onSelect}>
                <Label w={label_w}>{label}:</Label>
                <Button w={options_w}>{buttonLabel}</Button>
                <Options w={options_w}>
                    {options.map((opt) => (
                        <Option value={opt.value} key={opt.label}>
                            {({ active }) => {
                                return (
                                    <span style={{ background: active ? dark_pink: base_pink }}>
                                        {opt.label}
                                    </span>);
                            }}
                        </Option>
                    ))}
                </Options>
            </Listbox>
        </Container>
    );
}
const Options = styled(Listbox.Options)`
    width: ${({ w }) => w}px;
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
    border: 1px solid ${dark_blue};
    border-top: none;
    z-index: 4;
    position: relative;
    span {
        padding: 10px 0px;
        display: inline-block;
        box-sizing: border-box;
        line-height: normal;
        width: 100%;
        background:${base_pink};
    }
`;
const Label = styled(Listbox.Label)`
    width: ${({ w }) => w}px;
    display: inline-block;
`;

const Button = styled(Listbox.Button)`
    width: ${({ w }) => w}px;
    font-family: inherit;
    background: inherit;
    box-sizing: border-box;
    border: 1px solid ${dark_blue};
    cursor: pointer;
    padding: 10px 0;
    position: relative;
    color: inherit;
    :focus {
        outline: none;
    }
    :after {
        content: "";
        width: 0;
        height: 0;
        right: 10px;
        top: 17px;
        border-style: solid;
        position: absolute;
        border-width: ${({ is_open }) => is_open ? "0 3px 5.2px 3px" : "5.2px 3px 0 3px"};
        border-color: ${({ is_open }) => is_open ? `transparent transparent ${dark_blue} transparent` : `${dark_blue} transparent transparent transparent`};
    }
`;

const Container = styled.div`
    display: inline-block;
    font-size: 12px;
    width: ${({ w }) => w}px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: visible;
    margin-left: ${({ margin_left }) => margin_left}px;
    color: ${dark_blue};
    margin-bottom: 10px;
`;