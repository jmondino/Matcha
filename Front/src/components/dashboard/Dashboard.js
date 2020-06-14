import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios';
import M from 'materialize-css';

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token : this.props.match.params['token']
        };
    }


    componentDidMount = () => {
        if (this.state.token != null) {
        Axios.get("http://localhost:8080/api/active?token=" + this.state.token).then(
            res => {
                M.toast({html : "Bienvenue ! Votre compte est désormais actif. ", classes : "green toast-container-activation"});
            }).catch(e => {
                console.log(e);
            })
        }
    }

    render() {
        return (
            <div className="fullpage">
                <div className="full-love">
                    <img src="/img/ItCouldBeYou.jpg" className="full-love-img" alt="It could be you !"/>
                    <h2 className="catch" onClick={() => { this.props.history.push("/signin")}}>Ça pourrait-être vous !</h2>
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

export default connect(mapStateToProps)(Dashboard)
