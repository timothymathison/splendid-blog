
const roles = { user: 'user', admin: 'admin' };

function DynamoDBUser(u) {
    if(u.id) {
        this.ID = {"S": u.id}
    } else {
        throw 'Invalid user, missing "id" property'; // ID is required
    }

    if(u.role) {
        if(u.role === roles.user || u.role === roles.admin) {
            this.Role = {"S": u.role};
        } else {
            throw 'Invalid user, "role" propery is not an allowed value'; // Role must be one of several values
        }
    } else {
        throw 'Invalid user, missing "role" property'; // Role is required
    }

    if(u.hashedPassword) {
        this.HashedPassword = {"S": u.hashedPassword}; // HashedPassword is required
    } else {
        throw 'Invalid user, missing "hashedPassword property';
    }

    if(u.firstName) {
        this.FirstName = {"S": u.firstName};
    }

    if(u.lastName) {
        this.LastName = {"S": u.lastName};
    }

    if(u.email) {
        this.Email = {"S": u.email};
    }
};

DynamoDBUser.prototype.getRoles = () => roles;
DynamoDBUser.prototype.getProperties = function(other) {
    let u = other ? other : this;
    return {
        id: u.ID.S,
        role: u.Role.S,
        firstName: u.FirstName ? u.FirstName.S : null,
        lastName: u.LastName ? u.LastName.S : null,
        email: u.Email ? u.Email.S : null,
        hashedPassword: u.HashedPassword.S
    };
}

module.exports = DynamoDBUser;
