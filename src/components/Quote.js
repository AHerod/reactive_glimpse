import React, {useRef, useState} from "react";
//R3F
import {Canvas, useFrame} from "react-three-fiber";
// Deai - R3F
import {softShadows, MeshWobbleMaterial, Text, OrbitControls, Billboard, Html} from "drei";
// Styles
import "../App.scss";
// React Spring

softShadows();

const Quote = () => {
  return (
    <>
      {/* Our Scene & Camera is already built into our canvas */}
      <Canvas
        colorManagement
        shadowMap
        camera={{position: [0, 0, 10], fov: 60}}>
        {/* This light makes things look pretty */}
        <ambientLight intensity={0.3}/>
        {/* Our main source of light, also casting our shadow */}
        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {/* A light to help illumnate the spinning boxes */}
        <pointLight position={[-10, 0, -20]} intensity={0.5}/>
        <pointLight position={[0, -10, 0]} intensity={1.5}/>
        <group>
          {/* This mesh is the plane (The floor) */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
            receiveShadow>
            <planeBufferGeometry attach='geometry' args={[100, 100]}/>
            <shadowMaterial attach='material' opacity={0.3}/>
          </mesh>
          <Text
            color="pink" // default
            anchorX="center" // default
            anchorY="middle" // default
            position={[-2, 3, -3]}
            fontSize={1}
          >
            No object is mysterious.
          </Text>
          <Text
            color="pink" // default
            anchorX="center" // default
            anchorY="middle" // default
            position={[2, -2, -3]}
            fontSize={1}
          >
            The mystery is your eye.
          </Text>
        </group>
        <OrbitControls/>
      </Canvas>
    </>
  );
};

export default Quote;
