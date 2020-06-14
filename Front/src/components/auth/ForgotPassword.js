import React, { Component } from 'react'
import Axios from 'axios';
import M from 'materialize-css';
import ReactPasswordStrength from 'react-password-strength';

class ForgotPassword extends Component {

    is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            step : 1,
            email : null,
            password : null,
            vpassword : null,
            score : 0,
            pass_isvalid : false,
            min_score : 3
        };
    };

    getStep1 = () => {
        return (
            <li id="1" className="step step-active">
                <h4>Étape 1</h4>
                <form onSubmit={(e) => {this.onSubmit(e, 1)}}>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={this.handleChange} required/>
                    </div>
                    <div className="stepper-btn">
                        <button id="step-1" type="submit" className="btn stepper-next">Next</button>
                    </div>
                </form>
            </li>
        );
    }
    
    getStep2 = () => {
        return (
            <li id="2" className="step">
                <h4>Étape 2</h4>
                <p>Token envoyé à l'adresse : <i>{ this.state.email}</i></p>
                <form onSubmit={(e) => {this.onSubmit(e, 2)}}>
                    <div className="input-field">
                        <label htmlFor="token">Token de reset</label>
                        <input type="text" id="token" onChange={this.handleChange} required/>
                    </div>
                    <div className="stepper-btn">
                        <button type="submit" className="btn stepper-back" onClick={this.handlePrevious}>Back</button>
                        <button id="step-2" type="submit" className="btn stepper-next">Next</button>
                    </div>
                </form>
            </li>
        );
    }

    getStep3 = () => {
        return (
            <li id="3" className="step">
                <h4>Étape 3</h4>
                <form onSubmit={(e) => {this.onSubmit(e, 3)}}>
                    <ReactPasswordStrength className="input-field password-field" minLength={6} minScore={3}
                    scoreWords={['Faible', 'Moyen', 'Presque', 'Fort', 'Compliqué']}
                    tooShortWord={"Trop court"}
                    changeCallback={(e) => {this.handlePassword(e, "password")}}
                    inputProps={{ id: "password", name: "password", autoComplete: "off", placeholder: "Nouveau password"}}
                    />
                    <ReactPasswordStrength className="input-field password-field" minLength={6} minScore={3}
                    scoreWords={['Faible', 'Moyen', 'Presque', 'Fort', 'Compliqué']}
                    tooShortWord={"Trop court"}
                    changeCallback={(e) => {this.handlePassword(e, "vpassword")}}
                    inputProps={{ id: "vpassword", name: "password", autoComplete: "off", placeholder: "Vérification"}}
                    />
                    <div className="stepper-btn">
                        <button type="button" className="btn stepper-back" onClick={this.handlePrevious}>Back</button>
                        <button type="submit" className="btn stepper-final">Apply</button>
                    </div>
                </form>
            </li>
        );
    }

    getCurrentStep = () => {
        let step_display;

        if (this.state.step === 1) step_display = this.getStep1();
        else if (this.state.step === 2) step_display = this.getStep2();
        else step_display = this.getStep3();
        return (step_display);
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

    handleChange = (e) => {
        // console.log(e.target.id + " : " + e.target.value);
        if (this.is_mounted) {
            this.setState({
                [e.target.id] : e.target.value
            });
        }
    }

    handlePrevious = () => {
        if (this.is_mounted) {
            this.setState({
                step : this.state.step === 3 ? 1 : this.state.step - 1
            })
        }
    }
        

    updateStep = (status, step) => {
        if (step === 3 && status === 1) {
            this.props.history.push("/signin");
        }
        if (status === 1 && this.is_mounted) {
            this.setState({
                step : step + 1
            });
        }
    }

    // Need to know :
    //     - email
    //     - token
    //     - step
    onSubmit = (e, step) => {
        var status = 0;

        e.preventDefault();
        if (step === 1 ) {
            Axios.post("http://localhost:8080/api/recovery_password", {
                step,
                email: this.state.email
            }).then((response) => {
                if (response.data.status === 1) {
                    M.toast({html : response.data.success, classes : "green"});
                    status = 1;
                } else {
                    M.toast({html : response.data.error, classes : "red"});
                }
                this.updateStep(status, step);
            });
        } else if (step === 2) {
            Axios.post("http://localhost:8080/api/recovery_password", {
                step,
                email: this.state.email,
                token : this.state.token
            }).then((response) => {
                if (response.data.status === 1) {
                    M.toast({html : response.data.success, classes : "green"});
                    status = 1;
                } else {
                    M.toast({html : response.data.error, classes : "red"});
                }
                this.updateStep(status, step);
            });
        } else if (step === 3) {
            if (this.state.password !== this.state.vpassword) {
                M.toast({html : "Les mots de passe &nbsp;<b>ne correspondent pas</b> !", classes : "red"});
                return ;
            } else if (this.state.password === null || this.state.vpassword === null) {
                M.toast({html : "Les mots de passe ne peuvent être &nbsp;<b>vide</b> !", classes : "red"});
                return ;
            } else if (this.state.score < this.state.min_score) {
                M.toast({html : "Le mots de passe n'est pas assez fort", classes : "red"});
                return ;
            }
            Axios.post("http://localhost:8080/api/recovery_password", {
                step,
                email: this.state.email,
                token : this.state.token,
                password : this.state.password
            }).then((response) => {
                if (response.data.status === 1) {
                    M.toast({html : response.data.success, classes : "green"});
                    status = 1;
                } else {
                    M.toast({html : response.data.error, classes : "red"});
                }
                this.updateStep(status, step);
            });
        }
    }

    componentDidMount() {
        this.is_mounted = true;
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const step = this.getCurrentStep();
        return (
            <div className="stepper-row row">
                <ul className="stepper">
                    { step }     
                </ul>
            </div>
        )
    }
}

export default ForgotPassword
