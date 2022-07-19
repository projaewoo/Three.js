import React, {useEffect} from 'react';
import * as THREE from 'three';
import {Canvas, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import styled from "styled-components";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const Wrapper = styled.div`
    height: 100vh
`

const ReactThreeFiber = () => {

    const objectSrc = `${process.env.PUBLIC_URL}/NT_NO061/NT_NO061.obj`
    const [aoMap, map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_AO.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_D.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_N.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_R.png`
    ])

    const Model = (url: string) => {
        const obj = useLoader(OBJLoader, url);
        return <primitive object={obj}/>
    }

    return (
      <Wrapper>
          <Canvas onCreated={state => state.gl.setClearColor('black')}>
              <OrbitControls/>
              {/*<Stars/>*/}
              <ambientLight intensity={0.5}/>
              <pointLight position={[10, 15, 10]} angle={0.3}/>
              <mesh>
                {/*{Model(objectSrc)}*/}
                  <sphereBufferGeometry attach={'geometry'} args={[2, 64, 64]}/>
                  <meshStandardMaterial attach={'material'} map={map} aoMap={aoMap} normalMap={normalMap} roughnessMap={roughnessMap}/>
              </mesh>
          </Canvas>
      </Wrapper>
    );
}

export default ReactThreeFiber;