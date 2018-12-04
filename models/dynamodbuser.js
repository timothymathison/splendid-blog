
const roles = { user: 'user', admin: 'admin' };

function DynamoDBUser(u) {
    if(u.ID) {
        this.ID = {"S": u.ID}
    } else {
        throw new Error('Invalid user, missing "ID" property');
    }

    if(u.Role) {
        if(u.Role === roles.user || u.Role === roles.admin) {
            this.Role = {"S": u.Role};
        } else {
            throw new Error('Invalid user, "role" propery is not an allowd value');
        }
    } else {
        throw new Error('Invalid user, missing "Role" property');
    }

    if(u.HashedPassword) {
        this.HashedPassword = {"S": u.HashedPassword};
    } else {
        throw new Error('invalid user, missing "HashedPassword property');
    }

    if(u.FirstName) {
        this.FirstName = {"S": u.FirstName};
    }

    if(u.LastName) {
        this.LastName = {"S": u.LastName};
    }

    if(u.Email) {
        this.Email = {"S": u.Email};
    }
};

DynamoDBUser.prototype.getRoles = () => roles;

module.exports = DynamoDBUser;
