import React, { Component } from 'react'
import M from 'materialize-css';
import Axios from 'axios';
import { connect } from 'react-redux';
import Room from './Room';

function get_rooms(props) {
    Axios.post("http://localhost:8080/api/get_room", {
        id : props.auth.uid,
        token : props.auth.key
    }).then(response => {
        //console.log(response);
        if (response.data.status === 1) {
            if (response.data.success === null) return ;
            let array = response.data.success;
            if (this.is_mounted) {
                this.setState({
                    rooms : [...this.state.rooms, ...array]
                });
            }
        } else {
            M.toast({html : "Une erreur est servenue. Merci de réessayer ultérieurement.", classes : "red"});
        }
    });
}

/*
rooms : [
    {login : 1, firstname : "Laure", lastname : "Varich"},
    {login : 2, firstname : "Lucie", lastname : "Blue"},
    {login : 3, firstname : "Katrine", lastname : "Azure"},
    {login : 4, firstname : "Nathalie", lastname : "Huils"},
    {login : 5, firstname : "Patricia", lastname : "Ulrich"},
]*/

class Chat extends Component {
    is_mounted = false;

    // rooms : [login, firstname, lastname]
    state = {
        rooms : [],
        tab_active : 0,
    }

    constructor(props) {
        super(props);

        this.get_all_rooms = get_rooms.bind(this);
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    componentDidMount() {
        this.is_mounted = true;
        if (this.state.rooms.length > 0)
            M.Tabs.init(this.Tabs);
        this.get_all_rooms(this.props);
    }

    componentDidUpdate() {
        if (this.state.tab_active === 0 && this.state.rooms.length > 0){
            M.Tabs.init(this.Tabs);
            this.setState({
                tab_active : 1
            })
        }
        //console.log(this.state.rooms);
    }

    render() {
        var isThereRoom = this.state.rooms.length > 0;
        var rooms_display = null;
        if (isThereRoom) {
            rooms_display = <div className="row">
                                <div className="col s12">
                                    <ul className="tabs tabs-fixed-width" ref={Tabs => {this.Tabs = Tabs;}}>
                                        {
                                            this.state.rooms.map(room => {
                                                return <li className="tab col s3" key={room.login}><a href={ "#" + room.login }>{ room.firstname + " " + room.lastname }</a></li>
                                            })
                                        }
                                        {/*<li className="tab col s3"><a href="#test1">Test 1</a></li>
                                        <li className="tab col s3"><a className="active" href="#test2">Test 2</a></li>
                                        <li className="tab col s3"><a href="#test3">Test 3</a></li>
                                        <li className="tab col s3"><a href="#test4">Test 4</a></li>*/}
                                    </ul>
                                </div>
                                <div className="room-container">
                                    <div className="z-depth-3 col s12 room-wrapper">
                                        {
                                            this.state.rooms.map(room => {
                                                return <Room to={room.login} key={room.login}/>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
        } else {
            rooms_display = null
        }
        return (
            <div className="conv-anchor">
                <div className="conv">
                    { rooms_display }
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

export default connect(mapStateToProps)(Chat)
