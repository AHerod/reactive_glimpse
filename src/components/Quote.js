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
      <group>
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
    </>
  );
};

export default Quote;
