const { Op } = require('sequelize');
const db = require('../../models');

const calcKmDistance = (lat1, lng1, lat2, lng2) => {
    const R = Math.PI / 180;

    lat1 *= R;
    lng1 *= R;
    lat2 *= R;
    lng2 *= R;

    return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}

const getNearbyUsers = async (nowUserModel) => {
    console.log("fn getNearbyUsers");

    const User = db.User;
    const otherUsersModelList = await User.findAll({
        where: {
            [Op.and]: {
                active: 1,
                email: {
                    [Op.ne]: nowUserModel.getDataValue('email')
                }
            }
        }
    });

    console.log("fetch other users result:")
    console.log(otherUsersModelList);

    let nearbyUsers = [];

    for(let OthersModel of otherUsersModelList) {

        // console.log("calc target:")
        // console.log(OthersModel.getDataValue("email"));

        const distance = calcKmDistance(
                nowUserModel.getDataValue('lat'),
                nowUserModel.getDataValue('lng'),
                OthersModel.getDataValue('lat'),
                OthersModel.getDataValue('lng')
            );
        // console.log("calclated result: ", distance);
        // console.log("is nearby? :", distance < 5.00);

        if(distance < 5.00){
            nearbyUsers.push(OthersModel);
        }
    }

    // console.log(nearbyUsers);

    return nearbyUsers;
}

module.exports = getNearbyUsers;