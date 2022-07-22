import React, {useRef} from 'react';
import * as THREE from 'three';
import {Canvas, useGraph, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import styled from "styled-components";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {CameraControls, CameraControlsType} from "./cameraControls";

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
    const cameraControls = useRef<CameraControlsType | null>(null);
    const [aoMap, map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_AO.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_D.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_N.png`,
        `${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_R.png`,
    ])

    const scene = useLoader(OBJLoader, `${process.env.PUBLIC_URL}/NT_NO061/NT_NO061.obj`);
    const {nodes} = useGraph(scene);
    const { geometry } = nodes[Object.keys(nodes)[0]];
    const material = new THREE.MeshStandardMaterial({
        aoMap,
        map,
        normalMap,
        roughnessMap,
        roughness: 0.5,
        metalness: 0.6           // 좀 더 메탈스럽게 (색을 더 선명하게)
    })
    
    console.log('material', material)

    const playVideo = () => {
        cameraControls.current?.reset(true);
        setTimeout(() => {
            cameraControls.current?.rotate(Math.PI, 0, true)
        }, 1000)
        setTimeout(() => {
            cameraControls.current?.rotate(Math.PI, 0, true)
        }, 2000)
    }

    return (
      <Wrapper>
          <Canvas
            camera={{position: [3, 3, 3]}}
            onCreated={state => state.gl.setClearColor('black')}
          >
              <CameraControls ref={cameraControls} />
              <OrbitControls/>
              <pointLight
                color={'white'}
                intensisty={1}
                position={[10, 10, 10]}
              />
              <mesh
                position={[0, -2, 0]}
                geometry={geometry}
                material={material}
              />
          </Canvas>
          <div style={{ position: 'absolute', top: '0' }}>
              <button type={'button'} onClick={() => cameraControls.current?.rotate(Math.PI / 4, 0, true)}>
                  rotate theta 45deg
              </button>
              <button type={'button'} onClick={() => cameraControls.current?.reset(true)}>
                  reset
              </button>
              <button type={'button'} onClick={playVideo}>
                  play video
              </button>
          </div>
      </Wrapper>
    );
}

export default ReactThreeFiber;