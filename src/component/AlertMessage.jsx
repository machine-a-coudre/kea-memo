import React from "react";
import "./AlertMessage.scss";

const emptyConf = { show: false, messages: [] };

export default class AlertMessage extends React.Component {
    /**
     * Alert message component, display a given message during a given duration
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
    componentDidMount = () => this.displayMessage(this.state.messages[0], true)

    /**
     * 
     * @returns 
     */
    componentWillUnmount = () => clearMessages

    /**
     * Display a given message from now, and make it disappear if asked
     * 
     * @param {string} message The message to be displayed
     * @param {boolean} fade If true, make the message dispear at the end of the timer
     * @param {number} duration Duration if need to be overridden
     */
    displayMessage = (message, fade, duration) => {
        clearInterval(this.timerID);
        this.setState({ show: true, messages: [ message ] });

        if (fade) {
            this.timerID = setTimeout(
                () => { this.setState(emptyConf); },
                duration !== void 0 ? duration : this.props.timeout
            );
        }
    }

    /**
     * Clear all messages, clear associated timer with timerID
     */
    clearMessages = () => {
        clearInterval(this.timerID);
        this.setState(emptyConf);
    }

    /**
     * Render AlertMessage component
     * 
     * @returns {JSX.Element}
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