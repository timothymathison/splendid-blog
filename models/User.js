
const roles = { user: 'user', admin: 'admin' };
const getRoles = () => roles;

const DynamoDBUser = (u) => {
    let user = {};

    if(u.ID) {
        user.ID = {"S": u.ID}
    } else {
        throw new Error('Invalid user, missing "ID" property');
    }

    if(u.Role) {
        if(user.Role === roles.user || user.Role === roles.admin) {
            user.Role = {"S": u.Role};
        } else {
            throw new Error('Invalid user, "role" propery is not an allowd value');
        }
    } else {
        throw new Error('Invalid user, missing "Role" property');
    }

    if(u.HashedPassword) {
        user.HashedPassword = {"S": u.HashedPassword};
    } else {
        throw new Error('invalid user, missing "HashedPassword property');
    }

    if(u.FirstName) {
        user.FirstName = {"S": u.FirstName};
    }

    if(u.LastName) {
        user.LastName = {"S": u.LastName};
    }

    if(u.Email) {
        user.Email = {"S": u.Email};
    }
};

module.exports = {
    create: DynamoDBUser,
    getRoles: getRoles
}