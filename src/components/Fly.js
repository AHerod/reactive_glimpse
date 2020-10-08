import "../App.scss";
import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, {Suspense, useState, useCallback, useEffect, useRef, useMemo} from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import Effects from './Effects'
import Particles from './Particles'
import EyeBlue from "./EyeBlue";
import Amazon from "./Amazon";
import Quote from "./Quote";
import Swarm from "./Swarm";
import {Billboard, Text, OrbitControls} from "drei";
import EyeModel from "./EyeModel";

function Bubble({ count, mouse }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 10000
      const factor = 20 + Math.random() * 100
      const speed = 0.0001 + Math.random() / 1000
      const xFactor = -20 + Math.random() * 40
      const yFactor = -20 + Math.random() * 40
      const zFactor = -20 + Math.random() * 40
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.max(1.5, Math.cos(t) * 5)
      particle.mx += (mouse.current[0] - particle.mx) * 0.02
      particle.my += (-mouse.current[1] - particle.my) * 0.02
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <boxBufferGeometry attach="geometry" args={[.5, .5, .5]} />
        <meshPhongMaterial attach="material" specular='#64052C' color="#33FFBD" />
      </instancedMesh>
    </>
  )
}

function Fly() {
  //show other 3d elements
  const [hiddenQuote, setHiddenQuote] = useState(true);
  const [hiddenCubes, setHiddenCubes] = useState(true);
  const [hovered] = useState(false)
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
  function useToggle(initialValue = false) {
    const [value, setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => {
      setValue(v => !v);
    }, []);
    return [value, toggle];
  }
  const [isOn, toggleIsOn] = useToggle();
  // const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [hovered])


  return (
    <Canvas
      pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
      camera={{position: [-3, 1, 12], fov: 80}}
      // onMouseMove={onMouseMove}
      onMouseUp={() => set(false)}
      onMouseDown={() => set(true)}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#020207'))
      }} onMouseMove={onMouseMove}>

      <fog attach="fog" args={['lightblue', 15, 150]} />
      <ambientLight intensity={0.3}/>
      {/* Our main source of light, also casting our shadow */}
      <pointLight position={[-10, 0, -20]} intensity={.1}/>
      <pointLight position={[-20, -10, -40]} intensity={.1}/>
      <group>
        <Text
          color="pink" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[0, 10, -3]}
          fontSize={2}
          onClick={() => setHiddenQuote(!hiddenQuote)}
        >
          Quote
        </Text>
        <Text
          color="pink" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[10, 5, -1]}
          fontSize={3}
          onClick={() => setHiddenCubes(!hiddenCubes)}
        >
          Cubes
        </Text>
      </group>
      {
        hiddenQuote &&
          <Quote />
      }
      {
        hiddenCubes &&
        <group className={'swarmScreen'} style={{ width: '100%', height: '100%' }} onMouseMove={onMouseMove}>
          <Bubble mouse={mouse} count={300} args={[.1,.1,.1]} />
        </group>
      }
      <Suspense
        fallback={
          null
        }>
        <EyeModel scale={[.2,.2,.2]} onClick={toggleIsOn} />
      </Suspense>
      <Particles count={isMobile ? 5000 : 10000} mouse={mouse} />
      <Effects down={down} />
      {/* Remove OrbitControls to enable glitch*/}
      <OrbitControls />
    </Canvas>
  )
}

ReactDOM.render(<Fly />, document.getElementById('root'))


export default Fly;
