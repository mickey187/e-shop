const User = require('../models/User');


const createUser = async(user) => {
    try {
        return await User.create(user);
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }

}

module.exports = {createUser};