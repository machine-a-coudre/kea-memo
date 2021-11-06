import React from "react";
import Board from "./Board";
import "./Game.css";

function GameStatus(props) {
    const status = props.gameStarted ? "Click again." : "Start the game: click on a card.";
    
    return (
        <div className="component-game--status">{ status }</div>
    );
}

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameStarted: false,
            nbPlayer: 1,
        };

        this.startGame = this.startGame.bind(this);
    }

    handleClick = () => {
        this.setState({
            gameStarted: true
        });
    }

    startGame = () => { this.startGame = true }

    render() {
        const className = ["component-game"];

        return (
            <div className={ className.join(" ") }>
                <div className="component-game--inner" >
                    <h1>Kea Memory</h1>
                    <Board difficultyLvl={ 8 } startGame={ this.startGame } />
                    <GameStatus gameStarted={ this.props.gameStarted } />
                </div>
            </div>
        );
    }
}