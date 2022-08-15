function filterUserFields(userObject) {
    if (userObject) {
        const filteredUserObject = { ...userObject };
        delete filteredUserObject['passwordHash'];
        filteredUserObject['id'] = filteredUserObject._id;
        delete filteredUserObject['_id'];
        delete filteredUserObject['salt'];
        delete filteredUserObject['hashIterations'];
        delete filteredUserObject['__v'];
        return filteredUserObject;
    } else {
        return null;
    }
}

module.exports = exports = filterUserFields;
