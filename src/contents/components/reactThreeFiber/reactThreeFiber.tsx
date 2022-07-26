import React, {useRef} from 'react';
import * as THREE from 'three';
import {Canvas, useFrame, useGraph, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import styled from "styled-components";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {CameraControls, CameraControlsType} from "./cameraControls";
import LightController from "./lightController";

{/*
    TODO.
        1. loading progress
            https://docs.pmnd.rs/react-three-fiber/API/hooks#use-graph
*/
}

type moveType = 'rightToLeft' | 'leftToRight' | 'bottomToTop' | 'topToBottom' | 'rotation'

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
        metalness: 0.80           // 좀 더 메탈스럽게 (색을 더 선명하게)
    })
    
    const [startVideo, setStartVideo] = React.useState<boolean>(false);
    const [type, setType] = React.useState<moveType>('leftToRight')

    let startPoint = 3

    function Thing() {
        const lookAtPos = new THREE.Vector3()
        let height = 0.5;

        useFrame(state => {
            switch (type as moveType) {
                case 'leftToRight': {
                    console.log('leftToRight')
                    lookAtPos.x = -Math.sin(startPoint * 0.5)
                    lookAtPos.y = height;
                    lookAtPos.z = Math.sin(startPoint * 0.5)
                    startPoint += 0.01

                    if (lookAtPos.x > 0.99) {
                        setType('bottomToTop')
                    }
                    state.camera.lookAt(lookAtPos)
                    state.camera.updateProjectionMatrix()
                    break;
                }
                case 'bottomToTop': {
                    console.log('bottomToTop')
                    lookAtPos.x = 0
                    lookAtPos.y = Math.sin(-startPoint * 0.5)
                    lookAtPos.z = 0
                    startPoint += 0.01

                    if (lookAtPos.y > 0.99) {
                        setType('rightToLeft')
                    }
                    state.camera.lookAt(lookAtPos)
                    state.camera.updateProjectionMatrix()
                    break;
                }
                case 'rightToLeft': {
                    console.log('rightToLeft')
                    lookAtPos.x = Math.sin(startPoint * 0.5)
                    lookAtPos.y = height;
                    lookAtPos.z = -Math.sin(startPoint * 0.5)
                    startPoint += 0.01

                    if (lookAtPos.z > 0.99) {
                        setType('leftToRight')
                    }
                    state.camera.lookAt(lookAtPos)
                    state.camera.updateProjectionMatrix()
                    break;
                }
                default: return null;
            }
        })

        return (
          <mesh/>
        )
    }


    return (
      <Wrapper>
          <Canvas
            camera={{position: [3, 3, 3]}}
            onCreated={state => state.gl.setClearColor('black')}
          >
              <CameraControls ref={cameraControls} />
              <LightController/>
              <OrbitControls/>
              <axesHelper args={[5, 5, 5]}/>
              <mesh
                position={[0, -2, 0]}
                geometry={geometry}
                material={material}
              />
              {startVideo && <Thing/>}
          </Canvas>
          <div style={{ position: 'absolute', top: '0' }}>
              <button type={'button'} onClick={() => cameraControls.current?.rotate(Math.PI / 4, 0, true)}>
                  rotate theta 45deg
              </button>
              <button
                type={'button'}
                onClick={() => {
                    cameraControls.current?.reset(true);
                    setStartVideo(false);
                    setType('leftToRight')
                }}
              >
                  reset
              </button>
              <button type={'button'} onClick={() => setStartVideo(true)}>
                  start video
              </button>
          </div>
      </Wrapper>
    );
}

export default ReactThreeFiber;