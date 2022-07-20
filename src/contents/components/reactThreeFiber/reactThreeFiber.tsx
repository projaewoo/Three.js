import React from 'react';
import * as THREE from 'three';
import {Canvas, useGraph, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import styled from "styled-components";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

{/*
    TODO.
        1. loading progress
            https://docs.pmnd.rs/react-three-fiber/API/hooks#use-graph
*/
}

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

    const Model = (objectUrl: string) => {
        const scene = useLoader(OBJLoader, objectUrl);
        const { nodes, materials } = useGraph(scene);
        materials[Object.keys(materials)[0]].displacementMap = roughnessMap;
        materials[Object.keys(materials)[0]].displacementScale = 0.1;
        materials[Object.keys(materials)[0]].map = map;
        materials[Object.keys(materials)[0]].normalMap = normalMap;
        materials[Object.keys(materials)[0]].aoMap = aoMap;

        return <mesh geometry={nodes[Object.keys(nodes)[0]].geometry} material={materials[Object.keys(materials)[0]]}/>
    }

    return (
      <Wrapper>
          <Canvas onCreated={state => state.gl.setClearColor('black')}>
              <OrbitControls/>
              <pointLight position={[10, 15, 10]} angle={0.3}/>
              <mesh>
                  {Model(objectSrc)}
              </mesh>
          </Canvas>
      </Wrapper>
    );
}

export default ReactThreeFiber;