import React from "react";
import "./Card.css";

function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min)) + min;
}

export default class Card extends React.Component {
    /**
     * 
     * @param {object} props 
     */
    constructor(props) {
        super(props);

        this.state = { reversed: true };
        this.tY = getRandomArbitrary(-2, 2);
        this.tX = getRandomArbitrary(-2, 2);
        this.rD = getRandomArbitrary(-2, 2);
    }
    
    /**
     * Reverses card UI
     * 
     * @returns 
     */
    toggleStateReverse = () => this.setState({ reversed: !this.state.reversed })

    /**
     * On click handler
     */
    onClick = () => {
        const card = this;

        card.props.onUpdateCard(card)
            .then((board) => { card.setState({ reversed: !card.state.reversed }); })
            .catch(() => { /* Not allowed to do something, ignore... */ });
    }

    render() {
        const className = ["component-card"];

        if (this.state.reversed) {
            className.push("reversed");
        }

        return (
            <div
                style={{ transform: `translate(${ this.tX }px,${ this.tY }px) rotate(${ this.rD }deg)` }}
                className={ className.join(" ") } 
                onClick={ () => this.onClick() }
            >
                <div className="component-card--inner">
                    <div className="component-card--back"></div>
                    <div className="component-card--front">
                        <span>{this.props.value}</span>
                    </div>
                </div>
            </div>
        );
    }
}