import React from "react";
import AlertMessage from "./AlertMessage";
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
            gamerTurn: 1,
            gamersScores: Array(props.nbPlayers).fill(0),
            partyKey: Date.now(),
            timer: 0
        };

        this.alertElement = React.createRef();
        this.reversedCard = [];
        this.foundCard = [];
        this.timeoutIDs = [];
        this.newGame = true;
    }

    /**
     * 
     */
    componentDidMount = () => {
        this.preloadImages();
        this.tick();
    }

    /**
     * Credits to:
     * https://jack72828383883.medium.com/how-to-preload-images-into-cache-in-react-js-ff1642708240
     */
    preloadImages = () => {
        const promises = [
            "./images/magpie_yellow.jpg"
        ].map((src) => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve();
            img.onerror = reject();
        }));
        
        Promise.all(promises);
    }

    /**
     * @returns Promise
     */
    tick = () => {
        new Promise((resolve, reject) => {
            this.timerID = setInterval(
                () => {
                    if (this.state.timer === this.props.timerMax) {
                        clearInterval(this.timerID);
                        resolve(this.state.timer);
                    } else {
                        this.setState({ timer: this.state.timer + 1 });
                    }
                },
                1000
            );
        })
        .then((result) => {
            this.alertElement.current.displayMessage("Time out!", false);
        });
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

        window.clearInterval(this.timerID);

        if (this.alertElement.current) {
            this.alertElement.current.clearMessages();
        }
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

    /**
     * Get the player number turn
     * 
     * @returns bool
     */
    getPlayerTurn = () => this.state.gamerTurn + 1 > this.props.nbPlayers ? 1 : this.state.gamerTurn + 1

    /**
     * Create timeout and save ids (to be cleaned when reset game)
     * 
     * @param {function} fn 
     */
    addTimeout = (fn) => { this.timeoutIDs.push(setTimeout(fn, 1500)) };
    
    /**
     *  Handler on update card
     * 
     * @param {Card} card 
     * @returns 
     */
     onClickCard = (card) => {
        const board = this;
        const cardId = card.props.id;

        return new Promise((resolve, reject) => {
            let reversedCard = board.reversedCard;

            if (reversedCard.length < 2 && !reversedCard.find((_c) => _c.props.id === cardId)) {
                reversedCard.push(card);

                // If two cards reverted, start timer to auto revert
                if (reversedCard.length === 2) {
                    // Is same value ? validate
                    if (reversedCard[ 0 ].props.value === reversedCard[ 1 ].props.value) {
                        let winner = board.checkWinner();

                        board.alertElement.current.displayMessage("All right!", true);
                        board.foundCard = [ reversedCard[ 1 ], reversedCard[ 0 ], ... board.foundCard ];

                        // Reset reversedCards
                        if (!winner) {
                            board.reversedCard = [];
                        }

                        let gamersScores = board.state.gamersScores;
                        gamersScores[ board.state.gamerTurn - 1 ]++;
                        
                        // Update player score
                        board.setState({ gamersScores: gamersScores });

                        if (winner) {
                            board.addTimeout(() => {
                                board.alertElement.current.displayMessage(`Well done player ${ winner }!`, true);
                            });
                        }
                    } else {
                        // Update player turn
                        board.setState({
                            gamerTurn: board.getPlayerTurn()
                        });

                        board.alertElement.current.displayMessage(`Oh no! Try again... Player ${ board.getPlayerTurn() } your turn.`, true, 2000);

                        // Not same value, revert cards
                        board.addTimeout(() => {
                            reversedCard.map((_card) => { _card.toggleStateReverse() });

                            // Reset reversedCards
                            board.reversedCard = [];
                        });
                    }
                }
                
                resolve(board);
            } else {
                reject(board);
            }

            board.setState({ gameStarted: true });
        });
    };

    /**
     * Create data for new game
     */
    playGame = () => {
        this.clearAll();
        this.newGame = true;
        this.setState({ 
            cards: [], 
            distinctValue: [], 
            gameStarted: false,
            gamerTurn: 1,
            gamersScores: Array(this.props.nbPlayers).fill(0),            
            partyKey: Date.now(),
            timer: 0
        });
        this.tick();
    };
    
    /**
     * Renders one card
     * 
     * @param {string} key 
     * @param {number} val 
     * @returns 
     */
    renderCards = (key, val, ref) => { return <Card ref={ ref } key={ key + this.state.partyKey } id={ key } value={ val } onClickCard={ this.onClickCard.bind(this) } />; }

    /**
     * Renders component DOM
     * 
     * @returns
     */
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
                let random = getRandomArbitrary(1, 13);

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
                <AlertMessage text="Start the game: click on a card." timeout="1000" ref={ this.alertElement } />
                <div>Timer: { this.state.timer }s</div>
                <div className={ className.join(" ") }>
                    <div>{ cards }</div>
                </div>
                <div className="component-game--status">
                    <span className={ this.state.gamerTurn === 1 ? "bold" : "" }>Player 1:</span> { this.state.gamersScores[0] } - <span className={ this.state.gamerTurn === 2 ? "bold" : "" }>Player 2:</span> { this.state.gamersScores[1] }
                </div>
                <div>
                    <button className="component-game--btn-playgame" onClick={ this.playGame }>Play again</button>
                </div>
            </>
        );
    }
}