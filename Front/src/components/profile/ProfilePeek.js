import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import M from 'materialize-css';

export class ProfilePeek extends Component {

    is_mounted = false;

    state = {}
    /*state = {
        profile_id : 5468871046058184,
        profile_picture : "/img/users/StellaCox.jpg",
        //profile_picture : "/img/users/beautiful_female.jpg",
        firstname : "Stella",
        lastname : "Cox",
        age : 26,
        city : "Vernon",
        liked : false
    }*/

    constructor(props) {
        super(props);

        this.state = {
            ...props.profile
        };
    }

    handleChat = (e) => {
        if (e.nativeEvent.button === 1 || e.nativeEvent.button === 0) {
            if (e.nativeEvent.button === 1) {
                window.open("/socialRoom#" + this.state.login, "_blank");
            } else {
                this.props.history.push("/socialRoom"  + this.state.login);
            }
        }
        //M.toast({html : "Cette fonctionnalité n'est pas encore disponible.", classes: ""});
    }

    handleLike = (e) => {
        Axios.post("http://localhost:8080/api/like", {
            id : this.props.auth.uid,
            token : this.props.auth.key,
            login : this.state.login
        }).then(response => {
            let status = response.data.status;
            if (status === 0)
            {
                M.toast({html : response.data.error, classes: "red"});
            } else {
                let like = response.data.success;
                if (this.is_mounted) {
                    this.setState({
                        myLikeTo : like === "liked" ? true : false,
                        match : like === "MATCH" ? true : false
                    })
                }
            }
        })
    }

    redirect = (e, login) => {
        if (e.nativeEvent.button === 1 || e.nativeEvent.button === 0) {
            if (e.nativeEvent.button === 1) {
                window.open("/profiles/" + login, "_blank");
            } else {
                this.props.history.push("/profiles/" + login);
            }
          }
    }

    componentDidMount() {
        this.is_mounted = true;
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const liked_style = this.state.match ? "matched" : this.state.myLikeTo ? "liked" : this.state.likedBy ? "likedBy" : "unliked";
        const liked_icon_style = this.state.match ? "matched" : this.state.myLikeTo ? "icon-liked" : this.state.likedBy ? "likedBy" : "";
        return (
            <div className="col card profilePeek">
                <div className={this.state.log ? "online-badge" : "online-badge red"}></div>
                <div className="profile-image activator" onMouseDown={(e) => {this.redirect(e, this.state.login)}}>
                    <img src={"http://localhost:8080/" + this.state.profilePic} alt="" className="activator"/>
                </div>
                <div className="profilePeekActions">
                    <a href="#like" onClick={this.handleLike} className={"btn-floating btn-large waves-effect waves-light " + liked_style}>
                        <i className={"fa" + (this.state.match ? " fa-star " : this.state.likedBy ? " fa-question " : " fa-heart ") + liked_icon_style} aria-hidden="true"></i>
                    </a>
                    <a href={"/socialRoom#" + this.state.login} className={ this.state.match ? "btn-floating btn-large" : "btn-floating btn-large disabled" } onClick={this.state.match ? this.handleChat : null}>
                        <i className="material-icons">message</i>
                    </a>
                </div>
                <div className="card-content">
                    <span className="card-title activator grey-text center"  onMouseDown={(e) => {this.redirect(e, this.state.login)}}>{ this.state.firstname }</span>
                    <p className="pink-text center">{this.state.age} ans - {this.state.city}</p>
                </div>
            </div>
        )
    }
}

export default withRouter(ProfilePeek)