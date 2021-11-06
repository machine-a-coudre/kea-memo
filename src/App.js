import React, { Component} from "react";
import { hot } from "react-hot-loader";
import Game from "./component/Game";
import "normalize.css"
import "./App.scss";

class App extends Component{
  render(){
    return(
      <div className="Kea">
        <Game />
      </div>
    );
  }
}

export default hot(module)(App);