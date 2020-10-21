import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
import {Billboard, Text} from "drei";

const Billboards = forwardRef(({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }, ref) => {

  return (
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
  )
})

export default Billboards
