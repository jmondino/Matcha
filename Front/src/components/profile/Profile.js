import React, { Component } from 'react'
import { connect } from 'react-redux'
import M from 'materialize-css';
import Axios from 'axios';
import Score from './Score';

export class Profile extends Component {

    is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            profile : null
        };
    }

    handleChat = (e) => {
        if (e.nativeEvent.button === 1 || e.nativeEvent.button === 0) {
            if (e.nativeEvent.button === 1) {
                window.open("/socialRoom#" + this.state.profile.login, "_blank");
            } else {
                this.props.history.push("/socialRoom#" + this.state.profile.login);
            }
        }
        //M.toast({html : "Cette fonctionnalité n'est pas encore disponible.", classes: ""});
    }

    handleReport = (e) => {
        Axios.post("http://localhost:8080/api/report", {
            id : this.props.auth.uid,
            token : this.props.auth.key,
            login : this.state.profile.login
        }).then(response => {
            let status = response.data.status;
            if (status === 0)
            {
                M.toast({html : "Une erreur s'est produite. Merci de réessayer.", classes: "red"});
            } else {
                M.toast({html : "Le signalement de ce compte a bien été effectué.", classes : "orange"}); 
            }
        })
    }

    handleLike = (e) => {
        Axios.post("http://localhost:8080/api/like", {
            id : this.props.auth.uid,
            token : this.props.auth.key,
            login : this.state.profile.login
        }).then(response => {
            let status = response.data.status;
            if (status === 0)
            {
                M.toast({html : "An error occurred. Please retry later or contact staff.", classes: "red"});
            } else {
                let like = response.data.success;
                if (this.is_mounted) {
                    this.setState({
                        profile : {
                            ...this.state.profile,
                            myLikeTo : like === "liked" ? true : false,
                            match : like === "MATCH" ? true : false
                        }
                    })
                }
            }
        })
    }

    componentDidMount = () => {
        this.is_mounted = true;
        Axios.get("http://localhost:8080/api/profil/" + this.props.match.params['user_id'] + "?id=" + this.props.auth.uid + "&token=" + this.props.auth.key).then((response) => {
            let status = response.data.status;

            if (status === 0) {
                M.toast({html : "An error occurred. Please retry later or contact staff.", classes: "red"});
            } else {
                if (this.is_mounted) {
                    this.setState({
                        profile : response.data.success
                    })
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    componentDidUpdate() {
        let carousel = document.querySelector('.carousel');
        M.Carousel.init(carousel, {indicators:true});
    }

    render() {
        var i = 0;
        const user_profile = this.state.profile;
        var wants, sex, pictures, arr, liked_style, liked_icon_style, gender, gender_display, status, status_class = null;
        if (user_profile) {
            
            sex = user_profile.gender;
            
            let homo = sex === "Male" ? "fas fa-mars-double" : "fas fa-venus-double";
            let hetero = sex === "Male" ? "fas fa-venus" : "fas fa-mars";
            
            wants = user_profile.orientation === "Bisexual" ? "fas fa-venus-mars" : user_profile.orientation === "Hétérosexuel" ? hetero : homo;
            wants += " sweet_pink";
            gender = sex === "Male" ? "fas fa-mars" : "fas fa-venus";
            gender_display = sex === "Male" ? "Homme" : "Femme";

            status = user_profile.log === 0 ? "Dernière connexion : " + user_profile.last_log_date + " " + user_profile.last_log_hour : sex === "Male" ? "Connecté" : "Connectée";
            status_class = user_profile.log === 0 ? "red-text" : "green-text";

            if (user_profile.arr != null) {
                arr = ", " + user_profile.arr + "ème";
            }
            
            pictures = user_profile.images.length ? (
                <div className="">
                    <div className="divider center"></div>
                    <div className="section container">
                        <div className="carousel">
                        <h5 className="center">Petit aperçu de moi ;)</h5>
                            {user_profile.images.map((image, index) => {
                                return (// eslint-disable-next-line
                                    <a key={index} className="carousel-item images"><img src={"http://localhost:8080/" + image['link']} alt="Some stuff"/></a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : null;

            liked_style = user_profile.match ? "matched" : user_profile.myLikeTo ? "liked" : user_profile.likedBy ? "likedBy" : "unliked";
            liked_icon_style = user_profile.match ? "matched" : user_profile.myLikeTo ? "icon-liked" : user_profile.likedBy ? "likedBy" : "";
        }
        const page = user_profile ? (
        (
            <div className="container white whole-profile z-depth-3">
                <div className="row top-info">
                    <div className="col">
                        <div className="row s4 center fullprofile-holder"><img src={"http://localhost:8080/" + user_profile.profilePic} className="fullprofile-image center" alt="Principale"/></div>
                        <div className="actions">
                            <a href="#like" onClick={this.handleLike} className={"btn-floating btn-large waves-effect waves-light " + liked_style}>
                                <i className={"fa" + (user_profile.match ? " fa-star " : user_profile.likedBy ? " fa-question " : " fa-heart ") + liked_icon_style} aria-hidden="true"></i>
                            </a>
                            <a href={ "/socialRoom#" + this.state.profile.login } className={ user_profile.match ? "btn-floating btn-large" : "btn-floating btn-large disabled" } onMouseDown={this.handleChat}>
                                <i className="material-icons">message</i>
                            </a>
                            <a href="#!" className="btn-floating btn-large yellow darken-3" onClick={this.handleReport}>
                                <i className="material-icons">warning</i>
                            </a>
                        </div>
                    </div>
                    <div className="col s8 m6">
                        <h4 className="center">{user_profile.firstname} {user_profile.lastname} <Score score={user_profile.score}/></h4>
                        <div className="divider center"></div>
                        <h5 className="center">Biographie</h5>
                        <p>{user_profile.bio}</p>
                    </div>
                </div>
                <div className="divider center"></div>
                <div className="section container log_status">
                    <span className={status_class}>Status : { status }</span>
                </div>
                <div className="divider center"></div>
                <div className="row main-info">
                    <div className="col s4 center profile-info"><i className="fas fa-map-marker-alt"></i> {user_profile.city}{ arr } - {user_profile.dst} Kms</div>
                    <div className="col s4 center profile-info"><i className="fas fa-birthday-cake"></i> {user_profile.age} ans</div>
                    <div className="col s4 center profile-info"><i className={wants}></i> {user_profile.orientation} </div>
                </div>
                <div className="divider center"></div>
                <div className="row main-info">
                    <div className="center profile-info"><i className={gender}></i> { gender_display } </div>
                </div>
                <div className="divider center"></div>
                <div className="section container ">
                    <h5 className="center">Intérêts</h5>
                    <div className="row profile-tags">
                        { user_profile.tags.length ? user_profile.tags.map((tag, index) => {
                            return (
                                <div className="chip" key={index}>
                                    {tag}
                                </div>
                            )
                        }) : <div className="red-text">No tags</div> }
                    </div>
                </div>
                {pictures}
            </div>
        )) : (  <div className="preloader-wrapper active center-loader">
                    <div className="spinner-layer spinner-red-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                    </div>
                </div>) ;
        return page;
    }
}

const mapStateToProps = (state) => {
    return {
        ...state
    }
}

export default connect(mapStateToProps)(Profile)
