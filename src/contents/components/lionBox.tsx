import React, {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import WEBGL from "three/examples/jsm/capabilities/WebGL";

const LionBox = () => {

    let scene = new THREE.Scene();
    let light;
    let camera: any;
    let loader;       // OBJLoader 객체를 넣을 변수를 선언.
    let controls: any;

    useEffect(() => {
        initThree();
        addDirectionLight();
        loadLionBox();
    }, [])

    const initThree = () => {
        if (WEBGL.isWebGLAvailable()) {
            console.log('이 브라우저는 WEBGL을 지원합니다.')
        } else {
            console.log('이 브라우저는 WEBGL을 지원하지 않습니다.')
        }

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        // antialias:  true = 컴퓨터 그래픽에서 해상도의 한계로 선 등이 우둘투둘하지 않게
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(renderer.domElement);

        // x, y, z 축에 선을 그려줌
        // let axes = new THREE.AxesHelper(10);
        // scene.add(axes);

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
        light.castShadow = true;
        light.position.x = 5;
        light.position.y = 5;
        light.position.z = 5;
        scene.add(light);
    }

    const loadLionBox = () => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial({
            map: textureLoader.load('https://r105.threejsfundamentals.org/threejs/resources/images/wall.jpg'),
        })
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    }


    return (
      <></>
    )
}

export default LionBox