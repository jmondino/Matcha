import React, { Component } from 'react'
import { connect } from 'react-redux';
import Axios from 'axios';
import { authLogin, getProfile } from '../../store/actions/authActions';
import M from "materialize-css";

export class SignIn extends Component {

    is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    askForList = (id, key) => {
        Axios.get("http://localhost:8080/api/suggest_list?id=" + id + "&token=" + key).then(response => {
            let profiles_get = response.data;
            if (profiles_get) {
                if (profiles_get.status !== 1) {
                    M.toast({html : "An error occurred. Please retry later or contact staff.", classes: "red"});
                } else {
                this.props.populateProfiles(profiles_get.success);
                }
            }
        }).catch(function(err) {
            M.toast({html : "An error occurred. Please retry later or contact staff.", classes: "red"});
            M.toast({html : err.response, classes: "red"});
            console.log(err.response);
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:8080/api/login", {email : this.state.email, password : this.state.password}).then((response) => {
            const log_status = response.data;
            const status = log_status.status ? true : false;
            var user = -1;
            if (status) {
                //console.log(response);
                user = log_status.success.id;
                let token = log_status.success.token;
                this.props.authUser(user, token, log_status.success.firstname, log_status.success.lastname, log_status.success.login);
                this.props.history.push("/lucky");
                //this.askForList(user, token);
            } else {
                if (log_status.error === "email") {
                    var mail_input = document.getElementById("email");
                    mail_input.classList.add("login-error");
                    M.toast({html : "L'email entré est incorrect.", classes: "red"});
                    // console.log("Mail error");
                }
                else if (log_status.error === "password") {
                    var pwd_input = document.getElementById("password");
                    pwd_input.classList.add("login-error");
                    M.toast({html : "Le mot de passe entré est incorrect.", classes: "red"});
                    // console.log("Password error");
                } else if (log_status.error === "active") {
                    M.toast({html : "Ce compte n'est pas activé.", classes: "red"});
                }
                else console.log("Unknown error");
            }
        }).catch((error) => {
            console.log(error);
          });

    }

    handleChange = (e) => {
        var input = document.getElementById(e.target.id);
        input.classList.remove("login-error");
        if (this.is_mounted) {
            this.setState({
                [e.target.id]: e.target.value
            })
        }
    }

    componentDidMount() {
        this.is_mounted = true;
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        var error = this.state.error;
        return (
            <div>
                <div className="row">
                    { error }
                    <div className="col s8 m6 offset-s2 offset-m3 ">
                        <form className="white signin z-depth-3" onSubmit={this.handleSubmit}>
                            <h5 className="grey-text text-darken-3">Sign in</h5>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" onChange={this.handleChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" onChange={this.handleChange}/>
                            </div>
                            <div className="input-field">
                                <button className="btn pink lighten-1 z-depth-0">Login</button>
                                <button type="button" className="btn grey lighten-1 z-depth-1 right hide-on-med-and-down small" onClick={() => { this.props.history.push('/forgot-password') }}>Mot de passe oublié ?</button>
                                <i className="material-icons hide-fw-pwd right forgot_pwd" onClick={() => { this.props.history.push('/forgot-password') }}>https</i>
                            </div>
                        </form>
                    </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        authUser : (id, token, fname, lname, login) => { dispatch(authLogin(id, token, fname, lname, login)) },
        populateProfiles : (profiles) => { dispatch(getProfile(profiles)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
