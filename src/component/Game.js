import React from "react";
import Board from "./Board";
import "./Game.css";

export default class Game extends React.Component {
    render() {
        return (
            <div className="component-game">
                <div className="component-game--inner" >
                    <h1>Kea Memory</h1>
                    <Board difficultyLvl={ 2 } game="this" />
                </div>
            </div>
        );
    }
}