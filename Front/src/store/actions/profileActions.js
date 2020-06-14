
export const updateProfile = (profile) => {
    return {
        type : "PROFILE_UPDATE",
        login : profile.login,
        profile
    }
}