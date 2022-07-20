import React, {useRef} from 'react';
import * as THREE from 'three';
import {Canvas, useGraph, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import styled from "styled-components";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {CameraControls} from "./cameraControls";

{/*
    TODO.
        1. loading progress
            https://docs.pmnd.rs/react-three-fiber/API/hooks#use-graph
        2. material의 pixel이 깨지지 않게
            react three fiber materials map 등으로 검색
*/
}

const Wrapper = styled.div`
    height: 100vh
`

const ReactThreeFiber = () => {
    const cameraControls = useRef<CameraControls | null>(null);
    const [aoMap, map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_AO.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_D.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_N.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_R.png`
    ])
    const scene = useLoader(OBJLoader, `${process.env.PUBLIC_URL}/NT_NO061/NT_NO061.obj`);
    const {nodes, materials} = useGraph(scene);
    materials[Object.keys(materials)[0]].displacementMap = roughnessMap;
    materials[Object.keys(materials)[0]].displacementScale = 0.1;
    materials[Object.keys(materials)[0]].map = map;
    materials[Object.keys(materials)[0]].normalMap = normalMap;
    materials[Object.keys(materials)[0]].aoMap = aoMap;

    return (
      <Wrapper>
          <Canvas
            camera={{position: [3, 3, 3]}}
            onCreated={state => state.gl.setClearColor('black')}
          >
              <CameraControls ref={cameraControls}/>
              <OrbitControls/>
              <pointLight
                color={'white'}
                intensisty={1}
                position={[10, 10, 10]}
              />
              <mesh
                position={[0, -2, 0]}
                geometry={nodes[Object.keys(nodes)[0]].geometry}
                material={materials[Object.keys(materials)[0]]}
              />
          </Canvas>
          <div style={{ position: 'absolute', top: '0' }}>
              <button type={'button'} onClick={() => cameraControls.current?.rotate(Math.PI / 4, 0, true)}>
                  rotage theta 45deg
              </button>
              <button type={'button'} onClick={() => cameraControls.current?.reset(true)}>
                  reset
              </button>
          </div>
      </Wrapper>
    );
}

export default ReactThreeFiber;