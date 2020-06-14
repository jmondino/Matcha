const initState = {
    auth : {
        uid : -1,
        key : null,
        login : null,
        firstname : "",
        lastname : ""
    },
    chat : [],
    notifs : [],
    tags : [],
    filtered_profiles : []
}

function getIndex(value, arr, prop) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1; // to handle the case where the value doesn't exist
}

const rootReducer = (state = initState, action) => {
    if (action.type === "AUTH_LOGOUT") {
        return {
            ...state,
            auth : {
                uid : -1,
                key : null,
                login : null,
                firstname : "",
                lastname : ""
            },
            profiles : [],
            chat : [],
            notifs : [],
            tags : [],
        }
    }
    else if (action.type === "AUTH_USER") {
        return {
            ...state,
            auth : {
                uid : action.payload.uid,
                key : action.payload.key,
                login : action.payload.login,
                firstname : action.payload.firstname,
                lastname : action.payload.lastname
            }
        }
    }
    else if (action.type === "SEED_TAGS") {
        return {
            ...state,
            tags : action.payload.tags
        }
    }
    else if (action.type === "SEED_PROFILES") {
        return {
            ...state,
            profiles : action.profiles
        }
    }
    else if (action.type === "PROFILE_UPDATE") {
        let index = getIndex(action.login, state.profiles, 'login');
        if (index !== -1) {
            return {
                ...state,
                profiles : state.profiles.slice(0, index)
                    .concat(action.profile)
                    .concat(state.profiles.slice(index + 1))
            }
        }
    }
    else if (action.type === "NOTIF_ADD") {
        let notif_array = state.notifs;
        return {
            ...state,
            notifs : [...notif_array, action.payload.notif]
        }
    }
    else if (action.type === "NOTIF_READ") {
        let index = getIndex(action.payload.notif.id, state.notifs, 'id');
        let notifs = state.notifs.slice();
        notifs[index].readen = 1;
        return {
            ...state,
            notifs
        }
    } else if (action.type === "NOTIF_DELETE") {
        return {
            ...state,
            notifs : []
        }
    }
    return state;
}

export default rootReducer;