
const notFoundMsg = 'Perhaps you\'ve taken a wrong turn, route not found!';
const badRequestMsg = 'Whoops! The parameters provided aren\'t quite right, bad request';
const serverErrorMsg = `Whoops! Something went wrong, internal server error`;

const notFound = (res, msg) => {
    console.error('Route not found');
    res.status(404).send({ message: msg || notFoundMsg });
};

const badRequest = (res, msg) => {
    console.error('Bad request');
    res.status(400).send({ message: msg || badRequestMsg });
}

const notAcceptable = (res) => {
    console.error('Not acceptable content-type');
    res.status(406).end();
}

const serverError = (res, msg) => {
    console.error('Internal server error');
    res.status(500).send({ message: msg || serverErrorMsg });
};

module.exports = {
    notFound: notFound,
    badRequest: badRequest,
    notAcceptable: notAcceptable,
    serverError: serverError,
    notFoundMsg,
    badRequestMsg,
    serverErrorMsg,
}
