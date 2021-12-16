const db = require("../../models");

const getUserDataByEmail = async(email) => {
    console.log("fn getUserDataByGmail");

    const User = db.User;

    const result = await User.findOne({
        where: {
            email: email
        }
    });
    console.log("getting User Model result:");
    console.log(result);
    return result;
}

const getUserDataByID = async (id) => {
    console.log("fn getUserDataByID");

    const User = db.User;

    const result = await User.findOne({
        where: {
            id: id
        }
    });
    console.log("getting User Model result:");
    console.log(result);

    return result;
}

module.exports = {
    byEmail: getUserDataByEmail,
    byID: getUserDataByID
}