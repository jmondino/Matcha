
export const authLogin = (user_id, user_token, fname, lname, login) => {
    return {
        type : "AUTH_USER",
        payload : {
            uid : user_id,
            key : user_token,
            login,
            firstname : fname,
            lastname : lname
        }
    }
}

export const authOut = (user_id) => {
    return {
        type : "AUTH_LOGOUT",
    }
}

export const getProfile = (profiles) => {
    return {
        type : "SEED_PROFILES",
        profiles
    }
}