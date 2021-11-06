import React from "react";
import "./Board.css";
import Card from "./Card";

export default class Board extends React.Component {
    /**
     * 
     * @param {object} props 
     */
    constructor(props) {
        super(props);

        this.state = { cards: [], distinctValue: [] };        
        this.reversedCard = [];
        this.foundCard = [];
    }
    
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
                        board.foundCard = [ reversedCard[ 1 ], reversedCard[ 0 ], ... board.foundCard ];

                        // Reset reversedCards
                        if (board.foundCard.length < board.cards.length) {
                            board.reversedCard = [];
                        }
                    } else {
                        // Not same value, revert cards
                        setTimeout(() => {
                            reversedCard.map((_card) => { _card.toggleStateReverse() });

                            // Reset reversedCards
                            board.reversedCard = [];
                        }, 1000);
                    }
                }
                
                resolve(board);
            } else {
                reject(board);
            }
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
        let cards = [], distinctValue = [];

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
        board.cards = cards;

        return (
            <div className={ className.join(" ") }>
                <div>
                    { cards }
                </div>
            </div>
        );
    }
}