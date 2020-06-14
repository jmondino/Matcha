import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import ReactPasswordStrength from 'react-password-strength';
import { geolocated } from 'react-geolocated';
import M from 'materialize-css';

export class SignUp extends Component {

    is_mounted = false;

    state = {
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        login: '',
        btn_count: 0,
        pass_isvalid : false,
        score : 0,
        vpassword : ''
    }

    handlePassword = (e, type) => {
        if (type === "password" && this.is_mounted) {
            this.setState({
                password : e.password,
                pass_isvalid : e.isValid,
                score : e.score
            });
        } else if (type === "vpassword" && this.is_mounted) {
            this.setState({
                vpassword : e.password
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.score < 3) {
            M.toast({html:"Le mot de passe est trop faible.", classes : "red"});
            return ;
        } else if (this.state.password !== this.state.vpassword) {
            M.toast({html:"Les mots de passe ne correspondent pas.", classes : "red"});
            return ;
        }
        Axios.post("http://localhost:8080/api/create_user", {...this.state}).then((response) => {
            const data = response.data;
            if (data.status === 1) {
                M.toast({html: data.success, classes : "green"});
            } else {
                M.toast({html: data.error, classes : "red"});
            }
        }).catch((error) => {
            console.log(error);
          });
    }

    handleChange = (e) => {
        if (this.is_mounted) {
            this.setState({
                [e.target.id]: e.target.value
            })
        }
    }

    handleCheckBoxChange = (e) => {
        let count = this.state.btn_count;
        let msg = ""
        if (count === 0) msg = "Sympa non ? En vrai, ce bouton ne sert à rien.";
        else if (count <= 3) msg = "Si je te jure ! À rien !";
        else if (count < 10) msg = "Ça devient ridicule... Arrêtez...";
        else msg = "C'est bon ! Je ne vous parle plus. Au revoir !";
        if (count <= 10 && this.is_mounted) {
            this.setState({
             btn_count: count + 1
            });
            M.toast({html:msg});
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    componentDidMount() {
        this.is_mounted = true;
        document.querySelector("#allow-geo").checked = "checked";
    }

    render() {
        return (
            <div className="row">
                <div className="col s8 m4 offset-s2 offset-m4 ">
                    <form className="white signin z-depth-3" onSubmit={this.handleSubmit}>
                        <h5 className="grey-text text-darken-3">Sign up</h5>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="firstname" type="text" onChange={this.handleChange} className="validate" maxLength={30} required/>
                                <label htmlFor="firstname">First Name</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="lastname" type="text" onChange={this.handleChange} className="validate" maxLength={30} required/>
                                <label htmlFor="lastname">Last Name</label>
                            </div>
                        </div>
                        <div className="input-field">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" onChange={this.handleChange} className="validate"  maxLength={50} required/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="login">Login</label>
                            <input type="text" id="login" onChange={this.handleChange} className="validate" maxLength={30} required/>
                        </div>
                        <ReactPasswordStrength className="input-field password-field" minLength={6} minScore={3}
                            scoreWords={['Faible', 'Moyen', 'Presque', 'Fort', 'Compliqué']}
                            tooShortWord={"Trop court"}
                            changeCallback={(e) => {this.handlePassword(e, "password")}}
                            inputProps={{ id: "password", name: "password", autoComplete: "off", placeholder: "Nouveau password"}}/>
                        <ReactPasswordStrength className="input-field password-field" minLength={6} minScore={3}
                            scoreWords={['Faible', 'Moyen', 'Presque', 'Fort', 'Compliqué']}
                            tooShortWord={"Trop court"}
                            changeCallback={(e) => {this.handlePassword(e, "vpassword")}}
                            inputProps={{ id: "vpassword", name: "password", autoComplete: "off", placeholder: "Vérification"}}/>
                        <p>
                            <label>
                                <input id="allow-geo" type="checkbox" className="filled-in" onChange={this.handleCheckBoxChange}/>
                                <span htmlFor="allow-geo" >Allow geo-localisation</span>
                            </label>
                        </p>                                
                        <div className="input-field">
                            <button className="btn pink lighten-1 z-depth-0 waves-effect waves-light">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default geolocated({positionOptions: {enableHighAccuracy: false},userDecisionTimeout: 5000})(withRouter(SignUp));
