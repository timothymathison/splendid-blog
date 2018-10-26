
const require = (req, res, next) => {
    let token = req.get('Authorization');
    if(!token) {
        res.status(401).send({ message: 'Requires Authorization' });
    } else if(!token.startsWith('Bearer ')) {
        res.status(401).send({ message: 'Invalid Authorization' });
    }

    //TODO: check token validity and compare role
};

module.exports = {
    require: require
};
