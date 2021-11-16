import React from "react";
import "./AlertMessage.scss";

const emptyConf = { show: false, messages: [] };

export default class AlertMessage extends React.Component {
    /**
     * 
     * @param {object} props 
     */
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            messages: [ props.text ]
        };
    }

    /**
     * 
     * @returns 
     */
    componentDidMount = () => this.displayMessage( this.state.messages[0] )

    /**
     * 
     * @returns 
     */
    componentWillUnmount = () => clearMessages

    /**
     * 
     * @param {*} message 
     */
    displayMessage = (message) => {
        clearInterval(this.timerID);
        this.setState({ show: true, messages: [ message ] });

        this.timerID = setTimeout(
            () => { this.setState(emptyConf); },
            this.props.timeout
        );
    }

    /**
     * 
     */
    clearMessages = () => {
        clearInterval(this.timerID);
        this.setState(emptyConf);
    }

    /**
     * 
     * @returns 
     */
    render() {
        const { show, messages } = this.state;

        return (
            <div className={ `component-game--alert noselect ${ show && messages.length > 0 ? "show" : "hide" }` }>
            { messages.map((message, index) => 
                <div key={ index }>{ message }</div>
            ) }
            </div>
        );
    }
}