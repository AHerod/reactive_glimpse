/*
auto-generated by: https://github.com/pmndrs/gltfjsx
author: NikR (https://sketchfab.com/NikR)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/0641e66ea33c415694cf84f786178960
title: Amazon Prime shipping box
*/
import React, { useRef } from 'react'
import { useGLTFLoader } from '@react-three/drei/loaders/useGLTFLoader'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTFLoader('/scene_amazon.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[-22.33, -18.12, 0]}>
          <mesh material={materials.crate_texture} geometry={nodes.mesh_0.geometry} />
        </group>
      </group>
    </group>
  )
}
