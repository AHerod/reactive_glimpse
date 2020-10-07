import "../App.scss";
import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import Text from './Text'
import Effects from './Effects'
import Particles from './Particles'
import EyeBlue from "./EyeBlue";
import Amazon from "./Amazon";
import {OrbitControls} from "drei";
import EyeModel from "./EyeModel";

function Fly() {
  const [hovered] = useState(false)
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
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
      }}>
      <fog attach="fog" args={['lightblue', 15, 150]} />
      <ambientLight intensity={0.3}/>
      {/* Our main source of light, also casting our shadow */}
      <pointLight position={[-10, 0, -20]} intensity={.1}/>
      <pointLight position={[-20, -10, -40]} intensity={.1}/>
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
