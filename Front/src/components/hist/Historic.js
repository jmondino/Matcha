import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios';
import M from 'materialize-css';

class UserView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props.user
        }
    }

    render() {
        return (
            <li className="collection-item avatar" key={ this.state.login } onMouseDown={this.props.redirect}>
                <img src={ "http://localhost:8080/" + this.state.profilePic['link'] } alt="Profile visual" className="circle"/>
                <span className="title">{ this.state.firstname } { this.state.lastname }</span>
                <p>{this.state.age} ans<br/> {this.state.city}</p>
                <span className="secondary-content">{this.state.count}</span>
            </li>
        )
    }
}

class Historic extends Component {

    is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            historicDay : null,
            historicWeek : null,
            historicLike : null
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    componentDidMount() {
        this.is_mounted = true;
        Axios.post("http://localhost:8080/api/get_historic", {
            id : this.props.auth.uid,
            token : this.props.auth.key
        }).then((response) => {
            console.log(response.data);
            if (response.data.status === 0) {
                M.toast({html : "Une erreur s'est produite. Merci de réessayer." , classes : "red"});
                return ;
            }
            if (this.is_mounted) {
                this.setState({
                    historicDay : response.data.success.historicDay,
                    historicWeek : response.data.success.historicWeek,
                    historicLike : response.data.success.historicLike,
                }, () => {console.log(this.state)});
            }
        });
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

    render() {
        return (
            <div className="historic-page container">
                <div className="historic-views">
                    <div className="historic-day">
                        <h3>Vos admirateurs du jour</h3>
                        <ul className="collection">
                            { this.state.historicDay !== null && this.state.historicDay.map((user_view, index) => {
                                return <UserView user={user_view} redirect={(e) => {this.redirect(e, user_view.login)}} key={index}/>
                            })}
                            { (this.state.historicDay == null || this.state.historicDay.length === 0) ?
                                <li className="collection-item avatar" key="emptyDay" onClick={() => { M.toast({ html : "Désolé, il n'y a vraiment personne..."})}}>
                                    <span className="null-content"><i>C'est vide ici...</i></span>
                                </li>
                                :
                                null
                            }
                        </ul>
                    </div>
                    <div className="historic week">
                        <h3>Vos admirateurs de la semaine</h3>
                        <ul className="collection">
                            { this.state.historicWeek !== null && this.state.historicWeek.map((user_view, index) => {
                                    return <UserView user={user_view} redirect={(e) => {this.redirect(e, user_view.login)}}  key={index}/>
                                })}
                            { (this.state.historicWeek == null || this.state.historicWeek.length === 0) ?
                                <li className="collection-item avatar" key="emptyDay" onClick={() => { M.toast({ html : "Désolé, il n'y a vraiment personne..."})}}>
                                    <span className="null-content"><i>C'est vide ici...</i></span>
                                </li>
                                :
                                null
                            }
                        </ul>
                    </div>
                </div>

                <div className="historic-like">
                    <h3 className="pink-text"><i>Ils s'intéressent à vous</i></h3>
                    <ul className="collection">
                        { this.state.historicLike !== null && this.state.historicLike.map((user_view, index) => {
                                return <UserView user={user_view} redirect={(e) => {this.redirect(e, user_view.login)}}  key={index}/>
                            })}
                        { (this.state.historicLike == null || this.state.historicLike.length === 0) ?
                            <li className="collection-item avatar" key="emptyLike" onClick={() => { M.toast({ html : "Je suis certain d'avoir bien cherché ! Pourtant que de la poussière. Vos admirateurs sont-ils tous morts ?"})}}>
                                <span className="null-content"><i>Casper le fantôme sans compte</i></span>
                            </li>
                            :
                            null
                        }
                    </ul>
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

export default connect(mapStateToProps)(Historic);
