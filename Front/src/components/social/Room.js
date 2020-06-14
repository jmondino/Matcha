import React, { Component } from 'react'
import M from 'materialize-css';
import Axios from 'axios';
import { connect } from 'react-redux';
import Message from './Message';

function send_message(props, to, msg) {
    Axios.post("http://localhost:8080/api/send_message", {
        id : props.auth.uid,
        token : props.auth.key,
        to,
        msg
    }).then(response => {
        if (response.data.status === 1 && this.is_mounted) {
            this.setState({
                msg : ""
            });
        } else {
            M.toast({html : "Une erreur est servenue. Merci de réessayer ultérieurement.", classes : "red"});
        }
    });
}

function get_message(props, to) {
    Axios.post("http://localhost:8080/api/get_conv", {
        id : props.auth.uid,
        token : props.auth.key,
        to,
    }).then(response => {
        if (response.data.status === 1) {
            if (JSON.stringify(response.data.success) !== JSON.stringify(this.state.content)) {
                //console.log(response.data.success);
                /*console.log("Updating conversation");*/
                if (this.is_mounted) {
                    this.setState({
                        content : response.data.success,
                        update : 1
                    });
                }
            }
        } else {
            M.toast({html : "Une erreur est servenue. Merci de réessayer ultérieurement.", classes : "red"});
        }
    });
}

class Room extends Component {

    is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            msg : "",
            to : props.to,
            from : props.auth.uid,
            from_login : props.auth.login,
            content : [],
            current_index : 0,
            update : 1,
            display : []
        }

        this.snd_msg = send_message.bind(this);
        this.rcv_msg = get_message.bind(this);
        this.interval = setInterval(this.handleUpdateRoom, 1000);
        this.messagesEndRef = React.createRef()
    }

    handleUpdateRoom = () => {
        //console.log("Update message in progress");
        this.rcv_msg(this.props, this.state.to);
        this.handleMsgDisplay();
    }

    handleSend = (e, type) => {
        //console.log("sending : [" + this.state.msg + "]");
        if (type === 1) {
            if (e.key !== "Enter") {
                return ;
            }
        }
        if (this.state.msg === "") return ;
        this.snd_msg(this.props, this.state.to, this.state.msg);
        if (this.is_mounted) {
            this.setState({
                msg : ""
            })
        }
    }

    handleMsgUpdate = (e) => {
        if (this.is_mounted) {
            this.setState({
                msg : e.target.value
            });
        }
    }

    handleMsgDisplay = () => {
        var display = [];
        let index_up = this.state.current_index;
        if (this.state.content.length <= index_up) index_up = 0; 
        this.state.content.forEach((msg, index) => {
            //if (index_up <= index) {
                display.push(<Message sender={msg.sender} uid={this.state.from_login} msg={msg.msg} key={msg.id}/>);
                index_up = index;
            //}
        });
        if (this.is_mounted) {
            this.setState({
                current_index : index_up,
                display
            });
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.is_mounted = true;
        this.handleUpdateRoom();
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.is_mounted = false;
        clearInterval(this.interval);
    }

    render() {
        const msg_dp = this.state.display;
        return (
            <div className="room" id ={this.state.to}>
                <div className="room-msg">
                    {msg_dp}
                    <div id="end-anchor" ref={this.messagesEndRef}></div>
                </div>
                <div className="divider center"></div>
                <div className="field-wrapper">
                    <div className="input-field col s12">
                        <input type="text" name="msg" id={"msg-" + this.state.to} value={this.state.msg} onChange={(e) => {this.handleMsgUpdate(e)}} onKeyDown={(e) => {this.handleSend(e, 1)}}/>
                        <label htmlFor={"msg-" + this.state.to}>Message</label>
                    </div>
                    <div className="btn send" onClick={(e) => {this.handleSend(e, 0)}} onKeyDown={(e) => {this.handleSend(e, 1)}}><i className="far fa-paper-plane"></i></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      ...state
    }
}

export default connect(mapStateToProps)(Room)
