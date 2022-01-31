import React, { useState, useRef } from "react";
import styled from "styled-components";

const types = ["Year", "Metric", "Province"];

export function SortButtons({ setSortBy }) {
    const [active, setActive] = useState(types[0]);

    function handleClick(type) {
        setActive(type);
        setSortBy(type.toLowerCase());
    }

    return (
        <SortButtonContainer>
            {types.map(type => (
                <SortButton
                    key={type}
                    active={active === type}
                    onClick={() => handleClick(type)}
                >
                    {type}
                </SortButton>
            ))}
        </SortButtonContainer>
    );
}


const SortButtonContainer = styled.div`
    display: inline-block;
    z-index: 3;
`;

const SortButton = styled.div`
    display: inline-block;
    font-size: 13px;
    padding: 10px;
    border-radius: 50px;
    width: 50px;
    text-align: center;
    cursor: pointer;
    background: #FFF0E0;
    ${({ active }) =>
        active &&
        `background: lightpink;
    `}
`;