import React from 'react';
import {Canvas} from "@react-three/fiber";
import {OrbitControls, Stars} from "@react-three/drei";
import styled from "styled-components";

const Wrapper = styled.div`
    height: 100vh
`

const Cube = () => {

    return (
      <Wrapper>
          <Canvas>
              <OrbitControls/>
              <Stars/>
              <ambientLight intensity={0.5}/>
              <spotLight position={[10, 15, 10]} angle={0.3}/>
              <mesh position={[0, 0, 0]}>
                  <boxBufferGeometry attach={'geometry'}/>
                  <meshLambertMaterial attach={'material'} color={'orange'} />
              </mesh>
          </Canvas>
      </Wrapper>
    );
}

export default Cube;