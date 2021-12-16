const db = require("../../models");

const registerUser = async (userdata) => {
    console.log("fn registerUser");
    const User = db.User;
    // console.log(User);

    //isRegistered
    return await User.create({
        name: userdata.name,
        email: userdata.email,
        picture: userdata.picture,
        lat: '',
        lng: '',
        active: false,
    }).catch(err => {
        console.log(err);
        return false;
    });
}


module.exports = registerUser;