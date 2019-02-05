
const notFoundMsg = 'Perhaps you\'ve taken a wrong turn, route not found!';
const badRequestMsg = 'Whoops! The parameters provided aren\'t quite right, bad request';
const serverErrorMsg = `Whoops! Something went wrong, internal server error`;

const notFound = (res) => {
    console.error('Route not found');
    res.status(404).send({ message: notFoundMsg });
};

const badRequest = (res) => {
    console.error('Bad request');
    res.status(400).send({ message: badRequestMsg });
}

const serverError = (res) => {
    console.error('Internal server error');
    res.status(500).send({ message: serverErrorMsg });
};

module.exports = {
    notFound: notFound,
    badRequest: badRequest,
    serverError: serverError,
    notFoundMsg,
    badRequestMsg,
    serverErrorMsg,
}
