import React from "react";
import Board from "./Board";
import "./Game.css";

export default class Game extends React.Component {
    render() {
        const className = ["component-game"];

        return (
            <div className={ className.join(" ") }>
                <Board />
            </div>
        );
    }
}