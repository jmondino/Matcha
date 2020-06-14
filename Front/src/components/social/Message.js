import React, { Component } from 'react'

class Message extends Component {

    constructor(props) {
        super(props);

        this.state = {
            content : props.msg,
            sender : props.sender,
            uid : props.uid,
        }
    }

    render() {
        const classOfChip = this.state.sender === "Announcer" ? "announcer" : this.state.uid === this.state.sender ? "own" : "foreign";
        return (
            <div className="message-wrapper">
                <div className={ "chip message " + classOfChip }>
                    {this.state.content}
                </div>
            </div>
        )
    }
}

export default Message
