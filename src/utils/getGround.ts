import {Mesh} from "three";
import * as THREE from 'three';

export const getGround = (): Mesh => {
    const planeSize = 40;
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('https://r105.threejsfundamentals.org/threejs/resources/images/checker.png');

    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.magFilter = THREE.NearestFilter;

    const repeats = planeSize / 2;
    groundTexture.repeat.set(repeats, repeats);

    const planeGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMaterial = new THREE.MeshPhongMaterial({
        map: groundTexture,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.rotation.x = Math.PI * -.5;

    return mesh as Mesh;
}