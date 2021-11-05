import React from "react";
import Board from "./Board";
import "./Game.css";

export default class Game extends React.Component {
    render() {
        const className = ["component-game"];

        return (
            <div className={ className.join(" ") }>
                <div className="component-game--inner" >
                    <h1>Kea Memory</h1>
                    <Board difficultyLvl={ 4 } />
                </div>
            </div>
        );
    }
}