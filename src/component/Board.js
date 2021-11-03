import React from "react";
import "./Board.css";

export default class Board extends React.Component {
    render() {
        const className = ["component-board"];

        return (
            <div className={ className.join(" ") }>
            </div>
        );
    }
}