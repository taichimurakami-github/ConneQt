const renewUserData = async (User, renewContent={}) => {
    console.log("fn renewUserData");
    const content = {
        active: User.getDataValue('active'),
        lat: User.getDataValue('lat'),
        lng: User.getDataValue('lng'),

        ...renewContent
    }
    
    User.lat = content.lat;
    User.lng = content.lng;
    User.active = content.active;
    
    User.updatedAt = new Date();

    console.log("model has been renewed.");
    console.log("now renewing DB...");
    const result =  await User.save();

    console.log("renewed result:");
    console.log(result);
    return result;
}

module.exports = renewUserData;