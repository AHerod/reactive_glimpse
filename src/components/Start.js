import React, {useRef, useState} from "react";
//R3F
import {Canvas, useFrame} from "react-three-fiber";
// Deai - R3F
import {softShadows, MeshWobbleMaterial, Text, OrbitControls, Billboard, Html} from "drei";
// Styles
import "../App.scss";
// React Spring
import {useSpring, a} from "react-spring/three";
// React Flex
import { Flex, Box } from 'react-three-flex'
//Components
import Fly from "./Fly";
import Swarm from "./Swarm";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// soft Shadows
softShadows();

const SpinningMesh = ({position, color, speed, args}) => {
  //ref to target the mesh
  const mesh = useRef();

  //useFrame allows us to re-render/update rotation on each frame
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  //Basic expand state
  const [expand, setExpand] = useState(false);
  // React spring expand animation
  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });
  return (
    <a.mesh
      position={position}
      ref={mesh}
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow>
      <boxBufferGeometry attach='geometry' args={args}/>
      <MeshWobbleMaterial
        color={color}
        speed={speed}
        attach='material'
        factor={0.6}
      />
    </a.mesh>
  );
};
const Textsphere = ({ time, args, ...props }) => {
  return (
    <mesh {...props}>
      <sphereBufferGeometry attach="geometry" args={args}/>
      <meshStandardMaterial attach="material" color={'#0dcddb'} roughness={0.75} emissive="#404057"/>
      <Html scaleFactor={10}>
        <a href="/Users">userssss</a>
        <div className="content">
          Suspense <br/>
          {time}ms
        </div>
      </Html>
    </mesh>
  )
}

const Start = () => {
  return (
    <>
      {/* Our Scene & Camera is already built into our canvas */}
      <Canvas
        colorManagement
        shadowMap
        camera={{position: [-5, 2, 10], fov: 60}}>
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
            position={[0, 4, -3]}
            fontSize={2}
          >
            hello world!
          </Text>
          <SpinningMesh
            position={[0, 1, 0]}
            color='lightblue'
            args={[.75, .75, .75]}
            speed={2}
          />
          <Billboard position={[1.5, 2, 0]} args={[2.5, 2]}>
            <Text
              position={[0, 0, .5]}
              color="red" // default
              anchorX="center" // default
              anchorY="middle" // default
              fontSize={.2}
            >
              hello world!
            </Text>
          </Billboard>
          <SpinningMesh position={[-2, 1, -5]} color='pink' speed={6} args={[.5, .5, .5]}/>
          <SpinningMesh position={[5, 1, -2]} color='green' speed={6} args={[1, 1, 1]}/>
          <Textsphere time={500}  args={[1,30, 30]} position={[-2, 0, 0]} />
        </group>
        <OrbitControls/>
      </Canvas>
    </>
  );
};

export default Start;
