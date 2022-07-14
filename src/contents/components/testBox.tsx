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
    let light;
    let controls: any;

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

        controls = new OrbitControls(camera, renderer.domElement as HTMLCanvasElement);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.minDistance = 5;
        controls.maxDistance = 20;

        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
            controls.update();
        }

        animate();
    }

    const addDirectionLight = () => {
        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.x = 1;
        light.position.y = 1;
        light.position.z = 1;
        scene.add(light);
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