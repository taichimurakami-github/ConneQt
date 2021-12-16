const db = require("../../models");

const createUserData = async (userdata) => {
    console.log("fn createUserData");
    const User = db.User;

    return await User.create({
        name: userdata.name,
        email: userdata.name + "@testmail.com",
        lat: userdata.lat,
        lng: userdata.lng,
        active: true,
    }).catch(err => {
        console.log(err);
        return false;
    });
}


module.exports = createUserData;