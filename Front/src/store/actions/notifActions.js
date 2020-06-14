export const add_notif = (notif) => {
    return {
        type : "NOTIF_ADD",
        payload : {
            notif
        }
    }
}

export const delete_notif = (notif) => {
    return {
        type : "NOTIF_DELETE",
        paryload : {
            notif
        }
    }
}

export const read_notif = (notif) => {
    return {
        type : "NOTIF_READ",
        payload : {
            notif
        }
    }
}