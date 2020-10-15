import React, {useRef, useState, Suspense, useMemo, useEffect, useCallback} from "react";

//R3F
// Deai - R3F
import {softShadows, MeshWobbleMaterial, Text, OrbitControls, Billboard, Html, RoundedBox,Tube} from "drei";
// Styles
import "../App.scss";
// React Spring
import {useSpring, a} from "react-spring/three";
// React Flex
import { Flex, Box } from 'react-three-flex'
//Components
import Fly from "./Fly";
import Swarm from "./Swarm";
// npx @react-three/gltfjsx public/eye.gltf src/components/Eye.js
// Models
import Amazon from './Amazon'
import EyeBlue from './EyeBlue'
// from:
import * as THREE from 'three'
import ReactDOM from 'react-dom'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// Makes these prototypes available as "native" jsx-string elements
extend({ EffectComposer, ShaderPass, RenderPass, AfterimagePass, UnrealBloomPass })

function Cells({ count, mouse }) {
  const mesh = useRef()
  const light = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const dummy = useMemo(() => new THREE.Object3D(), [])
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.005 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])
  // The innards of this hook will run every frame
  useFrame(state => {
    // Makes the light follow the mouse
    light.current.position.set(mouse.current[0] / aspect, -mouse.current[1] / aspect, 0)
    // Run through the randomized data to calculate some movement
    particles.map((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (mouse.current[0] - particle.mx) * 0.01
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue">
        <mesh>
          <sphereBufferGeometry attach="geometry" args={[3.5, 32, 32]} />
          <meshBasicMaterial attach="material" color="lightblue" />
        </mesh>
      </pointLight>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[0.5, 0]} />
        <meshStandardMaterial attach="material" color="#700020" />
      </instancedMesh>
    </>
  )
}

function Effect() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
Z      <afterimagePass attachArray="passes" uniforms-damp-value={0.3} />
      <unrealBloomPass attachArray="passes" args={[aspect, 1.5, 1, 0]} />
      <shaderPass attachArray="passes" args={[FXAAShader]} uniforms-resolution-value={[1 / size.width, 1 / size.height]} renderToScreen />
    </effectComposer>
  )
}

function Dolly() {
  const { camera } = useThree()
  // This one makes the camera move in and out
  useFrame(({ clock }) => {
    camera.position.z = 50 + Math.sin(clock.getElapsedTime() * 0.5) * 10
    camera.updateProjectionMatrix()
  })
  return null
}


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
      const mouse = useRef([0, 0])
      const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
      return (
      <div style={{ width: '100%', height: '100%' }} onMouseMove={onMouseMove}>
        <Canvas camera={{ fov: 75, position: [0, 0, 70] }}>
          <pointLight distance={60} intensity={2} color="white" />
          <spotLight intensity={0.5} position={[0, 0, 70]} penumbra={1} color="lightblue" />
          <mesh>
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <meshPhongMaterial attach="material" color="#272727" depthTest={false} />
          </mesh>
          <Cells mouse={mouse} count={10000} />
          <Effect />
          <Dolly />
        </Canvas>
      </div>
      )
};

export default Start;
