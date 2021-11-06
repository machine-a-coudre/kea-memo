import React from "react";
import Board from "./Board";
import "./Game.scss";

export default class Game extends React.Component {
    render() {
        return (
            <div className="component-game theme--kea">
                <div className="component-game--inner" >
                    <h1>Kea Memory</h1>
                    <Board difficultyLvl={ 2 } nbPlayers={ 3 } game="this" />
                </div>
            </div>
        );
    }
}