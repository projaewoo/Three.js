import React, {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import WEBGL from "three/examples/jsm/capabilities/WebGL";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {Mesh} from "three";
import {getGround} from "src/utils/getGround";

const TestBox = () => {

    let renderer = new THREE.WebGLRenderer({antialias: true});
    let loader;
    let scene = new THREE.Scene();
    let camera: any;
    let cameraOrtho;
    let light;
    let controls: any;
    let controlsOrtho: any;

    useEffect(() => {
        initThree();
        addDirectionLight();
        loadObjLoader();
    })

    const initThree = () => {
        if (WEBGL.isWebGLAvailable()) {
            console.log('이 브라우저는 WEBGL을 지원합니다.')
        } else {
            console.log('이 브라우저는 WEBGL을 지원하지 않습니다.')
        }

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 2;
        camera.position.y = 1;
        camera.position.z = 1;

        const cameraOrthoInfo = {
            left: -3.2,
            right: 3.2,
            top: 5.4,
            bottom: -2.4,
            near: 0.01,
            far: 100
        }

        cameraOrtho = new THREE.OrthographicCamera(cameraOrthoInfo.left, cameraOrthoInfo.right, cameraOrthoInfo.top, cameraOrthoInfo.bottom, cameraOrthoInfo.near, cameraOrthoInfo.far);

        controls = new OrbitControls(camera, renderer.domElement as HTMLCanvasElement);
        controlsOrtho = new OrbitControls(cameraOrtho, renderer.domElement as HTMLCanvasElement);

        controls.rotateSpeed = controlsOrtho.rotateSpeed = 1.0;
        controls.zoomSpeed = controlsOrtho.zoomSpeed =1.2;
        controls.panSpeed = controlsOrtho.panSpeed = 0.8;
        controls.minDistance = controlsOrtho.minDistance = 5;
        controls.maxDistance = controlsOrtho.maxDistance = 20;

        const animate = () => {
            requestAnimationFrame(animate);

            renderer.autoClear = false;
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);

            cameraOrtho.position.copy(camera.position);
            cameraOrtho.updateProjectionMatrix();
            cameraOrtho.lookAt(scene.position);
            renderer.setViewport(10, window.innerHeight - 210, 200, 200);
            renderer.render(scene, cameraOrtho)

            controls.update();
            controlsOrtho.update();
        }

        animate();
    }

    const addDirectionLight = () => {
        light = new THREE.PointLight(0xffffff);
        light.position.set(1, 1, 1);            // (x, y, z)
        camera.add(light);                      // camera 돌릴 때마다, point light 비춰짐
        scene.add(camera);
    }

    const loadObjLoader = () => {
        loader = new OBJLoader();
        let textures = [] as Array<any>;
        const textureLoader = new THREE.TextureLoader();

        loader.load(`${process.env.PUBLIC_URL}/NT_NO061/NT_NO061.obj`, (object: any) => {
            textures = [
              textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_AO.png`),
              textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_D.png`),
              textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_N.png`),
              textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_M.png`),
              textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO061/Textures/T_NT_NO061_R.png`)
            ]

            const geometry = object.children[0].geometry;
            {/*
                aoMap => ..._AO.png
                map =>  ..._D.png
                normalMap => ..._N.png
                roughnessMap => ..._R.png
                roughness: 0 ~ 1 조절
            */}
            {/* light = new THREE.DirectionLight와 같이 직접적으로 light를 줘야
                    aoMap, normalMap, roughnessMap이 적용됌
             */}
            const material = new THREE.MeshStandardMaterial({
                aoMap: textures[0],
                map: textures[1],
                normalMap: textures[2],
                roughnessMap: textures[4],
                roughness: 0.8
            })
            object = new THREE.Mesh(geometry, material)
            scene.add(object);

            // 바닥 추가
            scene.add(getGround() as Mesh);
        }, xhr => {
            console.log(`${Math.ceil(xhr.loaded / xhr.total * 100)}% loaded`);
        }, error => {
            alert(error)
        })
    }

    return (
      <></>
    );
}

export default TestBox;