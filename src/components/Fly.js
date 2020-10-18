import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, {Suspense, useState, useCallback, useEffect, useRef, useMemo} from 'react'
import {Canvas, useFrame, useThree} from 'react-three-fiber'

// Components & Effects
import Effects from './Effects'
import Particles from './Particles'
import Quote from "./Quote";
import EyeModel from "./EyeModel";
import {Text, Stars, OrbitControls, Html, Billboard} from "drei";
import "../App.scss";
import RedEyeModel from "./RedEyeModel";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {useSubdivision} from "@react-three/drei";

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
          <meshBasicMaterial attach="material" color="lightblue" />
        </mesh>
      </pointLight>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[.7, 0]} />
        <meshStandardMaterial attach="material" color="#33FFBD" />
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
      <afterimagePass attachArray="passes" uniforms-damp-value={0.3} />
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



function Bubble({count, mouse}) {
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
      temp.push({t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0})
    }
    return temp
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let {t, factor, speed, xFactor, yFactor, zFactor} = particle
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
        <boxBufferGeometry attach="geometry" args={[.5, .5, .5]}/>
        <meshPhongMaterial attach="material" specular='#64052C' color="#33FFBD"/>
      </instancedMesh>
    </>
  )
}

function Fly() {
  const [hiddenQuote, setHiddenQuote] = useState(true);
  const [hiddenCubes, setHiddenCubes] = useState(true);
  const [hiddenRedEye, setHiddenRedEye] = useState(true);
  const [hiddenShapes, setHiddenShapes] = useState(true);
  const [hovered] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [hoverColor, setHoverColor] = useState(true);
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(({clientX: x, clientY: y}) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [hovered])


  return (
    <>

      <Canvas
        pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
        camera={{position: [-3, 1, 12], fov: 80}}
        onCreated={({gl}) => {
          gl.setClearColor(new THREE.Color('#020207'))
        }} onMouseMove={onMouseMove}>

        <fog attach="fog" args={['lightblue', 15, 150]}/>
        <ambientLight intensity={0.3}/>
        <pointLight position={[-10, 0, -20]} intensity={.1}/>
        <pointLight position={[-20, -10, -40]} intensity={.1}/>
        <group>
          <Billboard>
            <Text
              color={hiddenRedEye ? 'pink' : '#33FFBD'}
              position={[-10, 7, -5]}
              fontSize={1}
              onPointerOver={() => setHiddenRedEye(false)}
              onPointerOut={() => setHiddenRedEye(true)}
              depthOffset={10}
              font = {'Nova Square'}
            >
              Heterochromia
            </Text>
          </Billboard>

          <Billboard>
            <Text
              color={hiddenQuote ? 'pink' : '#33FFBD'}
              position={[0, 10, -3]}
              fontSize={2}
              onPointerOver={() => setHiddenQuote(false)}
              onPointerOut={() => setHiddenQuote(true)}
              depthOffset={10}
            >
              Quote
            </Text>
          </Billboard>

          <Billboard>
            <Text
              color={hiddenCubes ? 'pink' : '#33FFBD'}
              position={[10, 5, -1]}
              fontSize={3}
              onPointerOver={() => setHiddenCubes(false)}
              onPointerOut={() => setHiddenCubes(true)}
            >
              Cubes
            </Text>
          </Billboard>
          <Billboard>
            <Text
              color={hiddenShapes ? 'pink' : '#33FFBD'}
              position={[11, -2, 2]}
              fontSize={2}
              onPointerOver={() => setHiddenShapes(false)}
              onPointerOut={() => setHiddenShapes(true)}
            >
              Shapes
            </Text>
          </Billboard>
        </group>
        {
          !hiddenQuote &&
          <Quote/>
        }
        {
          !hiddenCubes &&
          <group className={'swarmScreen'} style={{width: '100%', height: '100%'}} onMouseMove={onMouseMove}>
            <Bubble mouse={mouse} count={300} args={[.1, .1, .1]}/>
          </group>
        }
        {
          !hiddenShapes &&
          <Cells mouse={mouse} count={1000} />
        }
        <Effect />
        <Suspense
          fallback={
            null
          }>
          {
            !hiddenRedEye &&
            <RedEyeModel scale={[.2, .2, .2]} onClick={() => setGlitch(!glitch)} position={[-10, 0, 0]}/>
          }
          <EyeModel scale={[.2, .2, .2]} onClick={() => setGlitch(!glitch)}/>
        </Suspense>
        <Particles count={isMobile ? 5000 : 10000} mouse={mouse}/>
        <Effects down={glitch}/>
        <OrbitControls/>
      </Canvas>
      <div className={'tooltip'}>
        <p>Organic, mocha qui shop acerbic con panna strong variety. Cup aged viennese a dripper so strong.</p>
      </div>
    </>
  )
}

ReactDOM.render(<Fly/>, document.getElementById('root'))


export default Fly;
