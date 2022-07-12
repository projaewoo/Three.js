import React from 'react';
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const LibertyStatue = () => {

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement as HTMLCanvasElement);

    const scene = new THREE.Scene();
    const loader = new OBJLoader();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerWidth, 0.1, 1000);
    let model: any;
    const controls = new OrbitControls(camera, renderer.domElement as HTMLCanvasElement);
    controls.screenSpacePanning = true;

    const addLight = () => {
        const light = new THREE.DirectionalLight(0xffffff, 4);
        light.position.set(0.5, 0, 0.866);
        camera.add(light);
    }

    const adjustModelAndCamera = () => {
        const box = new THREE.Box3().setFromObject(model as any);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();

        camera.position.copy(center);
        camera.position.x += size / 0.2;
        camera.position.y += size / 2;
        camera.position.z += size / 100;
        camera.lookAt(center);
    }

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    loader.load(
      `${process.env.PUBLIC_URL}/LibertyStatue/LibertStatue.obj`,
      obj => {
          console.log(obj)
          scene.add(obj);
          addLight();
          adjustModelAndCamera();
          scene.add(camera);
          renderer.render(scene, camera);
      },
      undefined,
      err => {
          console.log(err)
      }
    )

    return (
      <>
      </>
    );
}

export default LibertyStatue;