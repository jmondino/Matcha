import React, { Component } from 'react'
import { connect } from 'react-redux'
import M from 'materialize-css';
import { updateProfile } from '../../store/actions/profileActions';
import Axios from 'axios';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import { format, subYears } from 'date-fns';
import fr from 'date-fns/locale/fr';
import DatePicker, { registerLocale } from "react-datepicker";
import ReactPasswordStrength from 'react-password-strength';

registerLocale("fr", fr); // register it with the name you want

function getChipDeleted(e, data) {
    return (data.childNodes[0].textContent);
}

export class ProfileEdit extends Component {

    is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            profile : null,
            display_date : null,
            new_password : null,
            nv_password : null,
            places : [],
            cityIsValid : true,
            pass_isvalid : true,
            score : 0
        };

        this.deleteImageHelper = this.deleteImageHelper.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    handleChange = (e) => {
        if (e.target.id === "bio" || e.target.id === "firstname" || e.target.id === "lastname") {
            let test_arr = ['< ', ' >', ';', '<script>', '</script>'];
            let flag = false;
            for (let i = 0; i < test_arr.length; i++) {
                if (e.target.value.includes(test_arr[i])) {
                    M.toast({html : "'" + e.target.value[e.target.value.length - 1] + "' n'est pas un caractère accepté pour des raisons de sécurité (Balises scripts interdites).", classes : "red"});
                    flag = true;
                    break ;
                }
            }
            if (flag) return ;
        }
        if (this.is_mounted) {
            this.setState({
                [e.target.id] : e.target.value
            });
        }
    }

    handlePassword = (e, type) => {
        if (type === "password" && this.is_mounted) {
            let is_valid = e.password !== null && e.password !== "" ? e.isValid : true;
            let mscore = e.password !== null && e.password !== "" ? e.score : 3;
            this.setState({
                new_password : e.password,
                pass_isvalid : is_valid,
                score : mscore
            });
        } else if (type === "nv_password" && this.is_mounted) {
            this.setState({
                nv_password : e.password
            });
        }
    }

    getModifications = () => {
        let fields = ['firstname', 'lastname', 'birth', 'age', 'gender', 'orientation', 'bio', 'tags', 'city', 'arr'];
        let profile_update = {};

        fields.forEach((value, index) => {
            if (this.state[value] !== this.state.profile[value]) {
                profile_update = {
                    ...profile_update,
                    [value === "tags" ? "interest" : value] : this.state[value]
                }
            }
        });
        if (this.state.new_password !== null && this.state.new_password.length >= 4) {
            profile_update = {
                ...profile_update,
                password : this.state.new_password
            }
        }
        profile_update = {
            ...profile_update,
            email : this.state.email
        }
        return profile_update;
    }

    handleDate = (date) => {
        let birthday = format(date, 'dd/MM/yyyy');
        if (this.is_mounted) {
            this.setState({
                birth : birthday,
                display_date : date
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let today = new Date();
        let birth = Date.parse(this.state.birth);

        if (!this.state.cityIsValid) {
            M.toast({html : "Merci de mettre une des villes proposées ou de contacter le staff.", classes : "red"});
            return ;
        }
        if (/*this.state.age < 18 || this.state.age > 125 || */subYears(today, 18).getTime() < birth || subYears(today, 125).getTime() > birth) {
            M.toast({html : "Merci de mettre un âge entre 18 et 125 ans.", classes : "red"});
            return ;
        }
        //console.log(this.state);
        if (this.state.new_password !== this.state.nv_password) {
            M.toast({html : "Les nouveaux mot de passe ne correspondent pas.", classes : "red"});
            return ;
        }
        if (this.state.new_password !== null && !(this.state.score >= 3 && this.state.pass_isvalid)) {
            M.toast({html : "Le nouveau mot de passe n'est pas valide.", classes : "red"});
            return ;
        }
        if (this.state.email === null || this.state.email.length === 0) {
            M.toast({html : "Il vous faut un email valide !", classes : "red"});
            return ;
        }
        let {profile, password, new_password, nv_password, login, ...profile_update} = this.state; // this line is used to exclude profile field in the object we'll be disptaching
        profile_update = this.getModifications();
        //console.log(profile_update);
        //this.props.updateProfile(profile_update);
        Axios.post("http://localhost:8080/api/account_editor", {
            id : this.props.auth.uid,
            token : this.props.auth.key,
            ...profile_update
        }).then(response => {
            let data = response.data;
            let status = data.status;
            if (status === 0) {
                M.toast({html : data.error, classes : "red"});
            } else {
                M.toast({html : "Profile mis à jour :)", classes : "green"});
            }
        }).catch(e => {console.log(e)})
    }

    handlePositionChangeAC = (place) => {
        let valid = true;
        if (this.state.places.includes(place)) {
            document.querySelector(".check-pos").classList.remove("fa-times");
            document.querySelector(".check-pos").classList.remove("red-text");
            document.querySelector(".check-pos").classList.add("fa-check");
            document.querySelector(".check-pos").classList.add("green-text");
        } else {
            document.querySelector(".check-pos").classList.remove("fa-check");
            document.querySelector(".check-pos").classList.remove("green-text");
            document.querySelector(".check-pos").classList.add("fa-times");
            document.querySelector(".check-pos").classList.add("red-text");
            valid = false;
        }
        if (this.is_mounted) {
            this.setState({
                city : place,
                cityIsValid : valid
            })
        }
    }

    handlePositionChange = (e) => {
        let valid = true;
        if (this.state.places.includes(e.target.value)) {
            document.querySelector(".check-pos").classList.remove("fa-times");
            document.querySelector(".check-pos").classList.remove("red-text");
            document.querySelector(".check-pos").classList.add("fa-check");
            document.querySelector(".check-pos").classList.add("green-text");
        } else {
            document.querySelector(".check-pos").classList.remove("fa-check");
            document.querySelector(".check-pos").classList.remove("green-text");
            document.querySelector(".check-pos").classList.add("fa-times");
            document.querySelector(".check-pos").classList.add("red-text");
            valid = false;
        }
        if (this.is_mounted) {
            this.setState({
                city : e.target.value,
                cityIsValid : valid
            })
        }
    }

    uploadProfileTrigger = (e) => {
        this.inputElement.click();
    }

    uploadProfile = (e) => {
        var imagefile = document.querySelector('#profil_pic');

        if (imagefile.files.length < 1) return ;
        var idxDot = imagefile.files[0].name.lastIndexOf(".") + 1;
        var extFile = imagefile.files[0].name.substr(idxDot, imagefile.files[0].name.length).toLowerCase();
        if (!(extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "svg" || extFile === "gif")) {
            M.toast({ html: "Attention, le fichier n'est pas une image autorisée !", classes : "red"});
            return ;
        }

        const formData = new FormData();
        formData.append("profil", imagefile.files[0]);

        Axios({
            method: 'post',
            url: 'http://localhost:8080/api/images?id=' + this.props.auth.uid + "&token=" + this.props.auth.key,
            data: formData,
            headers: {'content-type': 'undefined' }
            })
            .then(function (response) {
                //handle success
                let status = response.data.status;
                if (status === 0) {
                    M.toast({ html: response.data.error, classes : "red"});
                    return ;
                } else {
                    M.toast({ html: "Image de profile ajoutée.", classes : "green"});
                    //console.log(response.data.success);
                    document.getElementById("profil_pic_trigger").setAttribute("src", "http://localhost:8080/" + response.data.success);
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    uploadImage = (e) => {
        var imagefile = document.querySelector('#supp_pic');

        var idxDot = imagefile.files[0].name.lastIndexOf(".") + 1;
        var extFile = imagefile.files[0].name.substr(idxDot, imagefile.files[0].name.length).toLowerCase();
        if (!(extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "svg" || extFile === "gif")) {
            M.toast({ html: "Attention, le fichier n'est pas une image autorisée !", classes : "red"});
            return ;
        }

        const formData = new FormData();
        formData.append("Supp_pic", imagefile.files[0]);

        Axios({
            method: 'post',
            url: 'http://localhost:8080/api/images?id=' + this.props.auth.uid + "&token=" + this.props.auth.key,
            data: formData,
            headers: {'content-type': 'undefined' }
            })
            .then(function (response) {
                //handle success
                let status = response.data.status;
                if (status === 0) {
                    M.toast({ html: response.data.error, classes : "red"});
                    return ;
                } else {
                    M.toast({ html: "Image ajoutée. Merci de rafraichir la page pour voir les changements", classes : "green"});
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response);
        });
    }

    deleteImageHelper = (index) => {
        let images_new = this.state.images.filter((img, id) => { return id !== index});
        if (this.is_mounted) {
            this.setState({
                images : images_new
            });
        }
    }

    deleteImage = (e, image, index) => {
        Axios({
            method: 'post',
            url: 'http://localhost:8080/api/delete_images',
            data: {
                id : this.props.auth.uid,
                token : this.props.auth.key,
                images : image
            }
            })
            .then(function (response) {
                //handle success
                //console.log(response);
                let status = response.data.status;
                if (status === 0) {
                    M.toast({ html: response.data.error, classes : "red"});
                    return ;
                } else {
                    M.toast({ html: "Image supprimée.", classes : "green"});
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response);
        });
        this.deleteImageHelper(index);
    }

    initTags = () => {
        let tags = document.querySelectorAll('.chips');
        let autocomplete_data = {};
        if (this.state.tags_server) {
            this.state.tags_server.map(tag => {
                return autocomplete_data[tag] = null;
            });
        }

        M.Chips.init(tags, {
            autocompleteOptions : {
                data : autocomplete_data,
                limit : Infinity,
                minLength : 1
            },
            onChipAdd : (chip) => {
                let value = chip[0].childNodes[chip[0].childNodes.length - 3].textContent;
                value = value.replace("close", "");
                if (!this.state.tags.includes(value) && this.is_mounted) {
                    this.setState({
                        tags : [...this.state.tags, value]
                    })
                }
            },
            onChipDelete : (e, data) => {
                let tag = getChipDeleted(e, data);
                //console.log("Deleted tag : " + tag);
                if (tag  && this.is_mounted) {
                  this.setState({
                    tags : this.state.tags.filter(ftag => { return ftag !== tag })
                  })
                }
            }
        });
    }

    askForTags = () => {
        Axios.get("http://localhost:8080/api/get_tags").then(response => {
            let tags = response.data;
            if (tags.length === 0 ) {
                M.toast({html : "No tags retrieved.", classes: "red"});
            } else {
                if (this.is_mounted) {
                this.setState({
                    tags_server : tags
                }, () => {
                this.initTags(); 
                } )};
            }
            }).catch(err => {
                console.log(err);
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    componentDidMount = () => {
        this.is_mounted = true;
        Axios.get("http://localhost:8080/api/my_account?id=" + this.props.auth.uid + "&token=" + this.props.auth.key).then((response) => {
            if (response.data != null) {
                if (response.data.status !== 1) {
                    M.toast({html : "An error occurred. Please retry later or contact staff.", classes: "red"});
                } else {
                    if (this.is_mounted) {
                        this.setState({
                            ...response.data.success,
                            display_date : Date.parse(response.data.success.birth),
                            profile : response.data.success
                        });
                    }
                }
            }
        }).catch(e => {console.log(e)});
        this.setCitiesList();
        this.askForTags();
    }

    setCitiesList = () => {
        Axios.get("http://localhost:8080/api/get_cities").then(response => {
            let cities = response.data;
            var Position = document.querySelectorAll('.autocomplete');
            var autocomplete_city = {};
            var state_city = [];
            cities.map(place => {
                return autocomplete_city[place.city] = null;
            });
            cities.map(place => {
                return state_city.push(place.city);
            });
            if (this.is_mounted) {
                this.setState({
                    places : state_city
                });
            }
            M.Autocomplete.init(Position, { data : autocomplete_city, limit : 5, minLength : 1, onAutocomplete : (place) => this.handlePositionChangeAC(place) });
        });
    }

    componentDidUpdate() {
        let bioArea = document.querySelector('#bio');
        if (bioArea)
            M.textareaAutoResize(bioArea);

        let selects = document.querySelectorAll('select');
        if (selects)
            M.FormSelect.init(selects);
        
        let carousel = document.querySelector('.carousel');
        M.Carousel.init(carousel, {indicators:true});

        this.initTags();
    }

    render() {
        var i = 0;
        const user_profile = this.state.profile;
        var homo, hetero, wants, sex, pictures, pictures_ui, gender = null;

        if (user_profile) {
            sex = this.state.gender;

            homo = sex === "Male" ? "fas fa-mars-double" : "fas fa-venus-double";
            hetero = sex === "Male" ? "fas fa-venus" : "fas fa-mars";

            wants = user_profile.orientation === "Bisexual" ? "fas fa-venus-mars" : this.state.orientation === "Hétérosexuel" ? hetero : homo;
            wants += " sweet_pink";
            gender = sex === "Male" ? "fas fa-mars" : "fas fa-venus";

            pictures = this.state.images.length ? (
                <div className="carousel">
                <h5 className="center">Petit aperçu de moi ;)</h5>
                    {this.state.images.map((image, index) => {
                        return (// eslint-disable-next-line
                            <a key={index} className="carousel-item images"><img src={"http://localhost:8080/" + image['link']} alt="Some stuff"/></a>
                        )
                    })}
                </div>
            ) : null;
            pictures_ui = this.state.images.length ? (
                <div className="pictures-ui">
                    {this.state.images.map((image, index) => {
                        return (// eslint-disable-next-line
                            <div className="btn red picture_ui" key={image + "-index:" + index} onClick={(e) => this.deleteImage(e, image, index)}> {index + 1} <i className="fas fa-times white-text"></i></div>
                            //<a key={index} className="carousel-item images"><img src={"http://localhost:8080/" + image['link']} alt="Some stuff"/></a>
                        )
                    })}
                </div>
            ): null;
        }
        const page = user_profile ? (
        (
            <div className="container white whole-profile z-depth-3">
                <form onSubmit={this.handleSubmit}>
                    <button className="btn waves-effect waves-light green save-btn" type="submit" name="save">Enregistrer
                        <i className="material-icons right">save</i>
                    </button>
                    <div className="private-info">
                        <div className="private-pass">
                            <ReactPasswordStrength className="input-field password-field pass-edit" minLength={6} minScore={3}
                                scoreWords={['Faible', 'Moyen', 'Presque', 'Fort', 'Compliqué']}
                                tooShortWord={"Trop court"}
                                changeCallback={(e) => {this.handlePassword(e, "password")}}
                                inputProps={{ id: "password", name: "password", autoComplete: "off", placeholder: "Nouveau password"}}
                            />
                            <ReactPasswordStrength className="input-field password-field pass-edit" minLength={6} minScore={3}
                                scoreWords={['Faible', 'Moyen', 'Presque', 'Fort', 'Compliqué']}
                                tooShortWord={"Trop court"}
                                changeCallback={(e) => {this.handlePassword(e, "nv_password")}}
                                inputProps={{ id: "nv_password", name: "nv_password", autoComplete: "off", placeholder: "Vérification"}}
                            />
                        </div>
                        <div className="private-email">
                            <div className="input-field col s12 private-item">
                                <input id="email" type="email" className="validate" value={this.state.email} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>
                    <div className="divider center"></div>
                    <div className="row top-info">
                        <div className="col">
                            <input id="profil_pic" type="file" onChange={this.uploadProfile} accept="image/*" ref={input => this.inputElement = input}/>
                            <div className="row s4 center fullprofile-holder"><img id="profil_pic_trigger" src={"http://localhost:8080/" + user_profile.profilePic} className="fullprofile-image center" alt="Principale" onClick={this.uploadProfileTrigger}/></div>
                            <div className="actions">
                            </div>
                        </div>
                        <div className="col s10 m6 basic-info">
                            <div className="naming-info">
                            <div className="input-field col s12 private-item">
                                <input id="firstname" type="text" className="validate" value={this.state.firstname} onChange={this.handleChange}/>
                            </div>
                            <div className="input-field col s12 private-item">
                                <input id="lastname" type="text" className="validate" value={this.state.lastname} onChange={this.handleChange}/>
                            </div>
                            </div>
                            {/* <h4 className="center">{user_profile.firstname} {user_profile.lastname}</h4> */}
                            <div className="divider center"></div>
                            <h5 className="center">Biographie</h5>
                            <textarea id="bio" className="materialize-textarea" value={this.state.bio} onChange={this.handleChange}></textarea>
                            <label htmlFor="bio">Biographie</label>
                        </div>
                    </div>
                    <div className="divider center"></div>
                    <div className="row main-info-edit">
                        <div className="center profile-info input-field pos-field">
                            <i className="fas fa-map-marker-alt prefix"></i>
                            <input type="text" id="autocomplete-input" className="autocomplete" value={this.state.city} onChange={this.handlePositionChange}/>
                            <i className="fas fa-check green-text check-pos"></i>
                        </div>
                        <div className="center profile-info"><i className={wants}></i>
                            <div className="input-field col s12">
                                <select defaultValue={this.state.orientation} id="orientation" onChange={this.handleChange}>
                                    <option value="Bisexuel">Bisexuel</option>
                                    <option value="Hétérosexuel">Hétérosexuel</option>
                                    <option value="Homosexuel">Homosexuel</option>
                                </select>
                                <label>Orientation</label>
                            </div>
                        </div>
                        <div className="center profile-info"><i className={gender}></i>
                            <div className="input-field col s12">
                                <select defaultValue={this.state.gender} id="gender" onChange={this.handleChange}>
                                    <option value="Male">Homme</option>
                                    <option value="Female">Femme</option>
                                </select>
                                <label>Genre</label>
                            </div>
                        </div>
                        
                        <div className="center profile-info"><i className="fas fa-birthday-cake"></i>&nbsp;
                            <DatePicker id="birthday" locale="fr" dateFormat="dd/MM/yyyy" selected={this.state.display_date} onChange={this.handleDate} autoComplete="off"/>
                            { /*maxDate={subYears(new Date(), 18)} minDate={subYears(new Date(), 125)}*/ }
                        </div>
                    </div>
                    <div className="divider center"></div>
                    <div className="section container">
                        <h5 className="center">Intérêts</h5>
                        <div className="tag-edit">
                            <div className="chips chips-autocomplete"></div>
                        </div>
                        <div className="row profile-tags">
                            { this.state.tags.length ?
                            this.state.tags.map((tag, index) => {
                                return (
                                    <div className="chip" key={index}>
                                        { tag }
                                        { /*<i className="material-icons close" onClick={() => {this.setState({
                                            tags : this.state.tags.filter(ftag => { return ftag !== tag })
                                        })}}>close</i>*/}
                                    </div>
                                )
                            }) : <div className="red-text">No tags</div> }
                        </div>
                    </div>
                    <div className="divider center"></div>
                    <div className="section container">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>Ajouter image</span>
                                <input id="supp_pic" type="file" onChange={this.uploadImage} accept="image/*"/>
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                        { pictures_ui }
                        { pictures }
                    </div>
                </form>
            </div>
        )) : (  <div className="center-loader"><div className="preloader-wrapper active">
                    <div className="spinner-layer spinner-red-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                    </div>
                </div></div>    ) ;
        return page;
    }
}

const mapStateToProps = (state) => {
    //let myprofile = state.profiles.filter(profile => profile.login === state.auth);
    return {
        ...state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile : (profile) => {dispatch(updateProfile(profile))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)
