// components/BradPittModel.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

export default function BradPittModel() {
  const { scene } = useThree();
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/model.FBX', (fbx) => {
      fbx.scale.set(0.01, 0.01, 0.01); // adjust as needed
      modelRef.current = fbx;
      scene.add(fbx);
    });
  }, [scene]);

  return null;
}
