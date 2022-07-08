import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from "@react-three/fiber";

const Cube2 = () => {

    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#000' });
    const mesh = new THREE.Mesh(geometry, material);
    const camera = new THREE.PerspectiveCamera(75, 800 / 600)
    scene.add(mesh)
    scene.add(camera);

    useEffect(() => {
        console.log(scene)
    }, [scene])

    return (
      <div>
          <Canvas>
          </Canvas>
      </div>
    )
}

export default Cube2;