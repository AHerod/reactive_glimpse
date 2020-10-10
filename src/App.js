import React, {useRef, useState, useEffect} from "react";

//Components
import Header from "./components/Header";
import Fly from "./components/Fly";
// Styles
import "./App.scss";
// React Spring


const App = ({ hideLoader }) => {
  useEffect(hideLoader, []);

  return (
    <>
      <Header/>
    </>
  );
};

export default App;
