import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, {Suspense, useState, useCallback, useEffect, useRef, useMemo} from 'react'
import { Canvas, useFrame } from 'react-three-fiber'

// Components & Effects
import Effects from './Effects'
import Particles from './Particles'
import Quote from "./Quote";
import EyeModel from "./EyeModel";
import {Text, Stars, OrbitControls, Html} from "drei";
import "../App.scss";

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
  const [hiddenQuote, setHiddenQuote] = useState(true);
  const [hiddenCubes, setHiddenCubes] = useState(true);
  const [hovered] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [hoverColor, setHoverColor] = useState(true);
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
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
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#020207'))
      }} onMouseMove={onMouseMove}>

      <fog attach="fog" args={['lightblue', 15, 150]} />
      <ambientLight intensity={0.3}/>
      <pointLight position={[-10, 0, -20]} intensity={.1}/>
      <pointLight position={[-20, -10, -40]} intensity={.1}/>
      <group>
        <Text
          color={ hiddenQuote ? 'pink' : '#33FFBD'}
          position={[0, 10, -3]}
          fontSize={2}
          onClick={() => setHiddenQuote(!hiddenQuote)}
          depthOffset={10}
        >
          Quote
        </Text>
        <Text
          color={ hiddenCubes ? 'pink' : '#33FFBD'}
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
        <EyeModel scale={[.2,.2,.2]} onClick ={() => setGlitch(!glitch)} />
      </Suspense>
      <Particles count={isMobile ? 5000 : 10000} mouse={mouse} />
      <Effects down={glitch} />
      <OrbitControls />
    </Canvas>
  )
}

ReactDOM.render(<Fly />, document.getElementById('root'))


export default Fly;
