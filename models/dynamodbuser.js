
const roles = { user: 'user', admin: 'admin' };

function DynamoDBUser(u) {
    if(u.ID) {
        this.ID = {"S": u.ID}
    } else {
        throw new Error('Invalid user, missing "ID" property'); // ID is required
    }

    if(u.Role) {
        if(u.Role === roles.user || u.Role === roles.admin) {
            this.Role = {"S": u.Role};
        } else {
            throw new Error('Invalid user, "role" propery is not an allowed value'); // Role must be one of several values
        }
    } else {
        throw new Error('Invalid user, missing "Role" property'); // Role is required
    }

    if(u.HashedPassword) {
        this.HashedPassword = {"S": u.HashedPassword}; // HashedPassword is required
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
DynamoDBUser.prototype.getProperties = function(other) {
    let u = other ? other : this;
    return {
        ID: u.ID.S,
        Role: u.Role.S,
        FirstName: u.FirstName ? u.FirstName.S : null,
        LastName: u.LastName ? u.LastName.S : null,
        Email: u.Email ? u.LastName.S : null,
        HashedPassword: u.HashedPassword.S
    };
}

module.exports = DynamoDBUser;
