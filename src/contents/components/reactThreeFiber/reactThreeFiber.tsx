import React, {useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {Canvas, useFrame, useGraph, useLoader, useThree, createPortal} from "@react-three/fiber";
import {OrbitControls, OrthographicCamera, useCamera} from "@react-three/drei";
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

type moveType = 'rightToLeft' | 'leftToRight' | 'bottomToTop' | 'topToBottom' | 'rotation';

type flag = {
    video: boolean,
    minimap: boolean
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
    const {geometry} = nodes[Object.keys(nodes)[0]];
    const material = new THREE.MeshStandardMaterial({
        aoMap,
        map,
        normalMap,
        roughnessMap,
        roughness: 0.5,
        metalness: 0.80           // 좀 더 메탈스럽게 (색을 더 선명하게)
    })

    const [flag, setFlag] = useState<flag>({video: false, minimap: true});
    const [type, setType] = useState<moveType>('leftToRight')

    let startPoint = 3
    const lookAtPos = new THREE.Vector3()

    const Video = () => {
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
                default:
                    return null;
            }
        })

        return (
          <mesh/>
        )
    }

    const Minimap = (): any => {
        const {gl, scene, camera, size} = useThree()
        const virtualScene = useMemo(() => new THREE.Scene(), [])
        const virtualCam = useRef()
        const ref = useRef(null)
        const matrix = new THREE.Matrix4()

        useFrame(() => {
            matrix.copy(camera.matrix).invert()
            ref.current.quaternion.setFromRotationMatrix(matrix)
            gl.autoClear = true
            gl.render(scene, camera)
            gl.autoClear = false
            gl.clearDepth()
            gl.render(virtualScene, virtualCam.current)
        }, 1)

        {/* TODO. minimap 안의 mesh의 metalness를 조정 */}
        return createPortal(
          <>
              {/*@ts-ignore*/}
              <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 300]}/>
              {/*<OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 100]}/>*/}
              <ambientLight/>
              <mesh
                scale={50}
                ref={ref}
                raycast={useCamera(virtualCam)}
                position={[size.width / 2 - 170, size.height / 2 - 250, 0]}         // 3d object 높이에 따라 변경
                // position={[size.width / 2 - 80, size.height / 2 - 80, 0]}
                geometry={geometry}
                material={material}
              />
              <mesh position={[size.width / 2 - 170, size.height / 2 - 170, 0]}>
                  <boxGeometry args={[100, 100, 100]}/>
                  <meshStandardMaterial color={0xffffff} wireframe/>
              </mesh>
              <ambientLight intensity={0.5}/>
              <pointLight position={[10, 10, 10]} intensity={0.5}/>
          </>,
          virtualScene
        )
    }

    const rotate = () => {
        cameraControls.current.rotate(Math.PI / 4, 0, true)
    }

    const reset = () => {
        cameraControls.current.reset(true);
        setFlag({video: false, minimap: true});
        setType('leftToRight')
    }

    const startVideo = () => {
        cameraControls.current.reset(true);
        setFlag({video: true, minimap: false});
    }

    return (
      <Wrapper>
          <Canvas
            camera={{position: [3, 3, 3]}}         // fov: 보여주는 높이?? (object height에 맞게 유동적으로 변환)
            onCreated={({ scene }) => scene.background = new THREE.Color('#000')}
          >
              <CameraControls ref={cameraControls}/>
              <LightController/>
              <OrbitControls/>
              {/*<axesHelper args={[5, 5, 5]}/>*/}
              <mesh
                position={[0, -2, 0]}
                geometry={geometry}
                material={material}
              />
              {/*{flag.minimap && <Minimap/>}*/}
              {/*{flag.video && <Video/>}*/}
          </Canvas>
          <div style={{position: 'absolute', top: '0'}}>
              {/*<button type={'button'} onClick={rotate}>*/}
              {/*    rotate theta 45deg*/}
              {/*</button>*/}
              {/*<button type={'button'} onClick={reset}>*/}
              {/*    reset*/}
              {/*</button>*/}
              {/*<button type={'button'} onClick={startVideo}>*/}
              {/*    start video*/}
              {/*</button>*/}
          </div>
      </Wrapper>
    );
}

export default ReactThreeFiber;