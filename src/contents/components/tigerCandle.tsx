import React, {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import WEBGL from "three/examples/jsm/capabilities/WebGL";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const TigerCandle = () => {

    let scene = new THREE.Scene();
    let light;
    let camera: any;
    let loader;       // OBJLoader 객체를 넣을 변수를 선언.
    let controls: any;

    useEffect(() => {
        initThree();
        addDirectionLight();
        loadObjLoader();
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

    const loadObjLoader = () => {
        loader = new OBJLoader();
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshLambertMaterial({ map: textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO060/Textures/T_NT_NO060_albedo.jpg`) });
        const material2 = new THREE.MeshLambertMaterial({ map: textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO060/Textures/T_NT_NO060_AO.jpg`) });
        const material3 = new THREE.MeshLambertMaterial({ map: textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO060/Textures/T_NT_NO060_metallic.jpg`) });
        const material4 = new THREE.MeshLambertMaterial({ map: textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO060/Textures/T_NT_NO060_normal.jpg`) });
        const material5 = new THREE.MeshLambertMaterial({ map: textureLoader.load(`${process.env.PUBLIC_URL}/NT_NO060/Textures/T_NT_NO060_roughness.jpg`) });

        loader.load(`${process.env.PUBLIC_URL}/NT_NO060/NT_NO060.obj`, (obj: any) => {
            const geometry = obj.children[0].geometry;
            const materials = [material, material2, material3, material4, material5];
            geometry.addGroup(0, geometry.getAttribute('position').count / 2, 0);
            geometry.addGroup(geometry.getAttribute("position").count/2,
              geometry.getAttribute("position").count/2,1);
            obj = new THREE.Mesh(geometry, materials);
            obj.position.y = 0;

            scene.add(obj);

            // 바닥 정의
            const planSize = 40;
            const loader = new THREE.TextureLoader();
            const groundTexture = loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/checker.png');
            groundTexture.wrapS = THREE.RepeatWrapping;
            groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.magFilter = THREE.NearestFilter;
            const repeats = planSize / 2;
            groundTexture.repeat.set(repeats, repeats);

            const planeGeo = new THREE.PlaneBufferGeometry(planSize, planSize);
            const planeMat = new THREE.MeshPhongMaterial({
                map: groundTexture,
                side: THREE.DoubleSide,
            });

            const mesh = new THREE.Mesh(planeGeo, planeMat);
            mesh.rotation.x = Math.PI * -0.5;
            scene.add(mesh);
        }, xhr => {
            console.log(xhr.loaded / xhr.total * 100, '% loaded');
        }, error => {
            alert(error)
        })
    }

    return (
      <></>
    );
}

export default TigerCandle;