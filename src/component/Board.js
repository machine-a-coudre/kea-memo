import React from "react";
import Card from "./Card";
import "./Board.scss";

export default class Board extends React.Component {
    /**
     * 
     * @param {object} props 
     */
    constructor(props) {
        super(props);

        this.state = { 
            cards: [], 
            distinctValue: [], 
            gameStarted: false, 
            gameMessage: "Start the game: click on a card.",
            gamerTurn: 1,
            gamersScores: Array(props.nbPlayers).fill(0)
        };

        this.reversedCard = [];
        this.foundCard = [];
        this.timeoutIDs = [];
        this.newGame = true;
    }

    /**
     * Clear timers
     */
    componentWillUnmount = this.clearAll;

    /**
     * Clear timers and cards
     */
    clearAll = () => {
        this.timeoutIDs.map((timeoutID) => window.clearTimeout(timeoutID));
        this.timeoutIDs = [];
        this.reversedCard = [];
        this.foundCard = [];
    }

    /**
     * Check if all cards returned meaning all cards have been found
     * 
     * @returns ?bool
     */
    checkWinner = () => 
        this.foundCard.length === this.state.cards.length ? 
            this.state.gamersScores.reduce((acc, current, index, arr) => arr[ acc ] < current ? index : acc, 0) + 1 
                : null;

    addTimeout = (fn) => { this.timeoutIDs.push(setTimeout(fn, 1000)) }
    
    /**
     *  Handler on update card
     * 
     * @param {Card} card 
     * @returns 
     */
     onClickCard = (card) => {
        const board = this;
        const cardId = card.props.id;

        //React.children

        return new Promise((resolve, reject) => {
            let reversedCard = board.reversedCard;

            // si la carte n'est pas déjà trouvée

            if (reversedCard.length < 2 && !reversedCard.find((_c) => _c.props.id === cardId)) {
                reversedCard.push(card);

                // If two cards reverted, start timer to auto revert
                if (reversedCard.length === 2) {
                    // Is same value ? validate
                    if (reversedCard[ 0 ].props.value === reversedCard[ 1 ].props.value) {
                        board.setState({ gameMessage: "All right!" });

                        board.foundCard = [ reversedCard[ 1 ], reversedCard[ 0 ], ... board.foundCard ];                        

                        let winner = board.checkWinner();

                        // Reset reversedCards
                        if (!winner) {
                            board.reversedCard = [];
                        }

                        let gamersScores = board.state.gamersScores;
                        gamersScores[ board.state.gamerTurn - 1 ]++;
                        
                        // Update gamer score
                        board.setState({ gamersScores: gamersScores });

                        board.addTimeout(() => {
                            board.setState({ gameMessage: winner ? `Well done gamer ${ winner }!` : "Click on a card." })
                        });
                    } else {
                        // Update gamer turn
                        board.setState({ 
                            gameMessage: "Oh no! Try again...",
                            gamerTurn: (board.state.gamerTurn + 1 > this.props.nbPlayers) ? 1 : board.state.gamerTurn + 1
                        });

                        // Not same value, revert cards
                        board.addTimeout(() => {
                            reversedCard.map((_card) => { _card.toggleStateReverse() });

                            // Reset reversedCards
                            board.reversedCard = [];

                            board.setState({ gameMessage: "Click on a card." });
                        });
                    }
                }
                
                resolve(board);
            } else {
                reject(board);
            }

            board.setState({ gameStarted: true });
        });
    }

    playGame = () => {
        this.clearAll();
        this.newGame = true;
        this.setState({ 
            cards: [], 
            distinctValue: [], 
            gameStarted: false, 
            gameMessage: "Start the game: click on a card.",
            gamerTurn: 1,
            gamersScores: Array(this.props.nbPlayers).fill(0),
        });
    }
    
    /**
     * Renders one card
     * 
     * @param {string} key 
     * @param {number} val 
     * @returns 
     */
    renderCards = (key, val, ref) => { return <Card ref={ ref } key={ key } id={ key } value={ val } onClickCard={ this.onClickCard.bind(this) } />; }

    render() {
        const className = ["component-board"];
        const board = this;
        const cards = this.state.cards;
        const distinctValue = this.state.distinctValue;

        if (this.newGame === true) {
            function getRandomArbitrary(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            // https://stackoverflow.com/a/2450976
            function shuffle(array) {
                let currentIndex = array.length,  randomIndex;
                
                // While there remain elements to shuffle...
                while (currentIndex != 0) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                
                    // And swap it with the current element.
                    [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }
                
                return array;
            }

            let n = 0;

            while (n < board.props.difficultyLvl) {
                let random = getRandomArbitrary(0, 100);

                if (distinctValue.indexOf(random) === -1) {
                    distinctValue.push(random);
                    n++
                }
            }

            distinctValue.map((val) => {
                cards.push(board.renderCards(`card-1${val}`, val, React.createRef()));
                cards.push(board.renderCards(`card-2${val}`, val, React.createRef()));
            });

            // Shuffle card for random display
            shuffle(cards);

            this.newGame = false;
        }

        return (
            <>
                <div className={ className.join(" ") }>
                    <div>{ cards }</div>
                </div>
                <div className="component-game--status">{ this.state.gameMessage }</div>
                <div>Gamer { this.state.gamerTurn } - Score: { this.state.gamersScores[this.state.gamerTurn -1] }</div>
                <div>
                    <button className="component-game--btn-playgame" onClick={ this.playGame }>Play again</button>
                </div>
            </>
        );
    }
}