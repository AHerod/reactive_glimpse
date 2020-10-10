import React from "react";
// React Router

//Components
import Start from "./Start";
import Fly from "./Fly";


// FS
import {FullScreen, useFullScreenHandle} from "react-full-screen";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Header = () => {
  const handle = useFullScreenHandle();
  return (

    <Router>
      <FullScreen handle={handle}>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/start">Start</Link>
              </li>
              <li>
                <Link to="/swarm">Swarm</Link>
              </li>
              <li>
                <Link to="/">Fly</Link>
              </li>
            </ul>
            <button onClick={handle.active ? handle.exit : handle.enter} className={'fullscreen__btn'}>
              <svg className={'fullscreen__btn--enter'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.111 451.111"><defs/><path fill="#00d0b2" d="M290 0l56.389 56.389L257.778 145l48.333 48.333 88.611-88.611 56.389 56.389V0zM145 257.778l-88.611 88.611L0 290v161.111h161.111l-56.389-56.389 88.611-88.611zM306.111 257.778l-48.333 48.333 88.611 88.611L290 451.111h161.111V290l-56.389 56.389zM161.111 0H0v161.111l56.389-56.389L145 193.333 193.333 145l-88.611-88.611z"/></svg>
              <svg className={'fullscreen__btn--exit'}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs/><g fill="#00d0b2"><path d="M24.586 27.414L29.172 32 32 29.172l-4.586-4.586L32 20H20v12zM0 12h12V0L7.414 4.586 2.875.043.047 2.871l4.539 4.543zM0 29.172L2.828 32l4.586-4.586L12 32V20H0l4.586 4.586zM20 12h12l-4.586-4.586 4.547-4.543L29.133.043l-4.547 4.543L20 0z"/></g></svg>
            </button>
          </nav>
        </header>
        <Switch>
          <Route path="/swarm">
            <h1>dadad</h1>
          </Route>
          <Route path="/start">
            <Start/>
          </Route>
          <Route path="/">
            <Fly/>
          </Route>
        </Switch>
      </FullScreen>
    </Router>
  );
};

export default Header;
