/*
auto-generated by: https://github.com/pmndrs/gltfjsx
author: charlos (https://sketchfab.com/charlos)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/0859e448e81b42eabd2db1178b69005f
title: Eye
*/
import React, { useRef } from 'react'
import { useGLTFLoader } from '@react-three/drei/loaders/useGLTFLoader'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTFLoader('/scene_eyeblue.gltf')
  return (
    <group ref={group} {...props}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh material={materials['Material.001']} geometry={nodes.mesh_0.geometry} />
        <mesh material={materials['Material.002']} geometry={nodes.mesh_1.geometry} />
      </group>
    </group>
  )
}

