import React from 'react';
import styled from "styled-components";

interface props {
    colors: string,
}

const Wrapper = styled.div<props>`
    color: ${(props) => (props.colors)}
`

const MainPage = () => {
    return (
      <Wrapper colors={'red'}>
          mainPAge
      </Wrapper>
    )
}

export default MainPage;