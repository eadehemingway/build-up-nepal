import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import styled from "styled-components";


export function Dropdown({ margin, label_width, options_width, label, value, options, onSelect, is_mobile }) {
    const [buttonLabel, setButtonLabel] = useState(options[0].label);
    function getLabelFromValue(){
        const l = options.find(o => o.value === value );
        setButtonLabel(l?.label);
    }
    useEffect(()=>{
        getLabelFromValue();
    }, [value]);

    const inactive_color = is_mobile ? null : "#FDC5FF";
    const label_w = label_width || 100;
    const options_w = options_width || 100;
    const dropdown_w = label_w + options_w;
    const margin_left = margin || 0;

    return (
        <Container w={dropdown_w} margin_left={margin_left}>
            <Listbox value={value} onChange={onSelect}>
                {({ open }) => (
                    <>
                        <Label w={label_w}>{label}:</Label>
                        <Button w={options_w} is_open={open}>{buttonLabel}</Button>
                        <Options w={options_w}>
                            {options.map((opt) => (
                                <Option value={opt.value} key={opt.label}>
                                    {({ active }) => (
                                        <span style={{ background: active ? null : inactive_color }}>
                                            {opt.label}
                                        </span>
                                    )}
                                </Option>
                            ))}
                        </Options>
                    </>
                )}
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
    width: ${({ w }) => w}px;
    display: inline-block;
`;

const Button = styled(Listbox.Button)`
    width: ${({ w }) => w}px;
    font-family: inherit;
    background: inherit;
    box-sizing: border-box;
    border: 1px solid #1400a3;
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
        border-color: ${({ is_open }) => is_open ? "transparent transparent #1400a3 transparent" : "#1400a3 transparent transparent transparent"};
    }
`;

const Container = styled.div`
    display: inline-block;
    font-size: 13px;
    width: ${({ w }) => w}px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: visible;
    margin-left: ${({ margin_left }) => margin_left}px;
    z-index: 4;
    background: #FFD6FF;
    color: #1400a3;
    margin-bottom: 10px;
`;