import React, { Component } from 'react';
import ProfilePeek from './ProfilePeek';
import M from 'materialize-css';
import Slider from 'rc-slider';
import { connect } from 'react-redux';
import Axios from 'axios';
import { getProfile } from '../../store/actions/authActions';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';


const Range = Slider.Range;

function getChipDeleted(e, data) {
  return (data.childNodes[0].textContent);
}

function hasTag(tags, profile) {
  let ok = false;
  if (tags.length === 0) return true;
  tags.forEach(tag => {
    if (profile.tags && profile.tags.includes(tag)) {
      ok = true;
    }
  });
  return ok;
}

class ProfileList extends Component {

    is_mounted = false;

    constructor(props) {
      super(props);

      let max_page = this.props.profiles ? Math.floor(this.props.profiles.length / 20) : 0;

      this.state = {
        filter : {
          lowerBound: 18,
          upperBound: 125,
          value: [18, 125],
        },
        pop : {
          lowerBound: 0,
          upperBound: 100,
          value: [0, 100],
        },
        dst : {
          lowerBound: 0,
          upperBound: 100,
          value: [0, 20],
        },
        page : 1,
        max_page,
        epp : 20,
        tags : [],
        filter_tags : [],
        filtered_profiles : [],
        sort_age : 0,
        sort_pop : 0,
        sort_dst : 0,
        sort_tsyn : 0,
      };

      this.onConstruct();
    }

    onConstruct = () => {
      Axios.get("http://localhost:8080/api/my_account?id=" + this.props.auth.uid + "&token=" + this.props.auth.key).then((response) => {
            if (response.data != null) {
                if (response.data.status !== 1) {
                    M.toast({html : "An error occurred. Please retry later or contact staff.", classes: "red"});
                } else {
                  if (this.is_mounted) {
                    this.setState({
                      ...this.state,
                      profile : response.data.success
                    }, () => {
                      let interval = [this.state.profile.age - 3, this.state.profile.age + 3];
                      if (this.is_mounted) {
                        this.setState({
                          ...this.state.profile,
                          filter : {
                            ...this.state.filter,
                            value : interval
                          },
                          pop : {
                            ...this.state.pop,
                            value : [this.state.profile.score - 10, 100]
                          }
                        })
                      }
                    });
                  }
                }
            }
        }).catch(e => {console.log(e)})
    }

    onSliderChange = (value) => {
      if (this.is_mounted) {
        this.setState({
          filter : { ...this.state.filter, value },
        }, () => {
          this.setOutput();
          this.setOutput();
        });
      }
    }
    onSliderDstChange = (value) => {
      if (this.is_mounted) {
        this.setState({
          dst : { ...this.state.dst, value },
        }, () => {
          this.setOutput();
          this.setOutput();
        });
      }
    }
    onSliderPopChange = (value) => {
      if (this.is_mounted) {
        this.setState({
          pop : { ...this.state.pop, value },
        }, () => {
          this.setOutput();
          this.setOutput();
        });
      }
    }

    onSortChange = (e) => {
      let elem = document.getElementById(e.target.id);
      let var_state = this.state[e.target.id];
      if (var_state === 0) elem.classList.remove("fa-sort");
      else if (var_state === 1) elem.classList.remove("fa-sort-up");
      else if (var_state === 2) elem.classList.remove("fa-sort-down");
      elem.classList.add(var_state === 0 ? "fa-sort-up" : var_state === 1 ? "fa-sort-down" : "fa-sort");
      if (this.is_mounted) {
        this.setState({
          [e.target.id] : var_state === 0 ? 1 : var_state === 1 ? 2 : 0
        }, () => {
          this.askForList();
          this.askForList();
        });
      }
    }

    handlePageChange = (page) => {
      if (this.is_mounted) {
        this.setState({
          page
        })
      }
    }
  
    initTags = () => {
      let tags = document.querySelectorAll('.chips');
      let autocomplete_data = {};
      this.state.tags.map(tag => {
        return autocomplete_data[tag] = null;
      })
      M.Chips.init(tags, {
        autocompleteOptions : {
            data : autocomplete_data,
            limit : Infinity,
            minLength : 1
        },
        onChipAdd : (chip) => {
            let value = chip[0].childNodes[chip[0].childNodes.length - 3].textContent;
            value = value.replace("close", "");
            if (this.is_mounted) {
              this.setState({
                filter_tags : [...this.state.filter_tags, value]
              }, () => {this.setOutput();this.setOutput();});
            }
        },
        onChipDelete : (e, data) => {
          let tag = getChipDeleted(e, data);
          if (tag && this.is_mounted) {
            this.setState({
              filter_tags : this.state.filter_tags.filter(ftag => { return ftag !== tag })
            }, () => {this.setOutput();this.setOutput();})
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
                tags
              }, () => {
                this.initTags(); 
              });
            }
          }
        }).catch(err => {
            console.log(err);
      });
    }

    setOutput = () => {
      let result = [];
      if (this.props.profiles) {
        this.props.profiles.forEach((profile) => {
          if (profile.age >= this.state.filter.value[0] && profile.age <= this.state.filter.value[1] && hasTag(this.state.filter_tags, profile)
            && profile.score >= this.state.pop.value[0] && profile.score <= (this.state.pop.value[1] === 100 ? 101 : this.state.pop.value[1])
            && profile.dst >= this.state.dst.value[0] && profile.dst <= this.state.dst.value[1]) {
              // console.log(profile.age + " >= " + this.state.filter.value[0] + " && " + profile.age + " <= " + this.state.filter.value[1]);
              result = [...result, profile];
            }
        })
      }
      if (this.is_mounted) {
        this.setState({
          filtered_profiles : result,
          max_page : result ? Math.floor(result.length / 20) : 0
        }, /*console.log(this.state.filtered_profiles)*/);
      }
    }

    askForList = () => {
      Axios.post("http://localhost:8080/api/suggest_list", {
        "id" : this.props.auth.uid,
        "token" : this.props.auth.key,
        "age" : this.state.sort_age,
        "dst" : this.state.sort_dst,
        "score" : this.state.sort_pop,
        "tsyn" : this.state.sort_tsyn
      }).then(response => {
          let profiles_get = response.data;
          if (profiles_get) {
              if (profiles_get.status !== 1) {
                  M.toast({html : profiles_get.error, classes: "red"});
              } else {
                this.props.populateProfiles(profiles_get.success);
                this.setOutput();
                this.setOutput();
              }
          }
        }).catch(err => {
          console.log(err);
      })
    }

    componentWillUnmount() {
      this.is_mounted = false;
    }

    componentDidMount() {
      this.is_mounted = true;
      this.askForTags();
      this.askForList(this.state.sort_age,this.state.sort_dst,this.state.sort_pop,this.state.sort_tsyn);

      var elems = document.querySelectorAll('.collapsible');
      M.Collapsible.init(elems, null);
    }

    render() {
        return (
            <div className="container">
                <div className="profile-search">
                <ul className="collapsible collapsible-search">
                    <li>
                        <div className="collapsible-header"><i className="material-icons">settings</i>Filtres</div>
                        <div className="collapsible-body">
                        <div className="section">
                          <fieldset className="sort-options-fieldset">
                            <legend>Trie</legend>
                            <div className="row sort-options">
                              <div className="col s3">
                                  <label>Par age : </label>
                                  <i id="sort_age" className="fas fa-sort" alt="Trie" onClick={this.onSortChange}></i>
                              </div>
                              <div className="col s3">
                                  <label>Par distance : </label>
                                  <i id="sort_dst"  className="fas fa-sort" alt="Trie" onClick={this.onSortChange}></i>
                              </div>
                              <div className="col s3">
                                  <label>Par popularité : </label>
                                  <i id="sort_pop"  className="fas fa-sort" alt="Trie" onClick={this.onSortChange}></i>
                              </div>
                              <div className="col s3">
                                  <label>Par synergie de tags : </label>
                                  <i id="sort_tsyn" className="fas fa-sort" alt="Trie" onClick={this.onSortChange}></i>
                              </div>
                            </div>
                          </fieldset>
                          <fieldset className="sort-options-fieldset">
                            <legend>Recherche avancée</legend>
                            <div className="row">
                              <div className="col s4">
                                <label>Âge entre : {this.state.filter.value[0]} - {this.state.filter.value[1]}</label>
                                <Range allowCross={true} min={18} max={125} value={this.state.filter.value} onChange={this.onSliderChange}/>
                              </div>
                              <div className="col s4">
                                <label>Distance : {this.state.dst.value[0]} - {this.state.dst.value[1]}</label>
                                <Range allowCross={true} min={0} max={250} value={this.state.dst.value} onChange={this.onSliderDstChange}/>
                              </div>
                              <div className="col s4">
                                <label>Popularité : {this.state.pop.value[0]} - {this.state.pop.value[1]}</label>
                                <Range allowCross={true} min={0} max={100} value={this.state.pop.value} onChange={this.onSliderPopChange}/>
                              </div>
                            </div>
                            <div className="tag-filter">
                                <div className="chips filter-tags">
                                  <input className="custom-class"/>
                                </div>
                            </div>
                          </fieldset>
                          </div>
                        </div>
                    </li>
                </ul>
                </div>
                <div className="row profile-row s8 m8">
                  { this.state.filtered_profiles && this.state.filtered_profiles.map((profile, index) => {
                    if (index >= (this.state.page - 1) * this.state.epp && index < (this.state.page) * this.state.epp) {
                      return <ProfilePeek profile={profile} key={profile.login} auth={this.props.auth}/>
                    } else return null;
                  })}
                </div>
                <Pagination current={this.state.page} pageSize={this.state.epp} total={this.state.filtered_profiles.length} className="center list-pagination" onChange={this.handlePageChange}/>
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
      populateProfiles : (profiles) => { dispatch(getProfile(profiles)) }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileList)