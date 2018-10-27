
const notFound = (res) => {
    console.error('Route not found');
    res.status(404).send({ message: 'Perhaps you\'ve taken a wrong turn, route not found!' });
};

const badRequest = (res) => {
    console.error('Bad request');
    res.status(400).send({ message: 'Whoops! The parameters provided aren\'t quite right, bad request' });
}

const serverError = (res) => {
    console.error('Internal server error');
    res.status(500).send({ message: `Whoops! Something went wrong, internal server error` });
};

module.exports = {
    notFound: notFound,
    badRequest: badRequest,
    serverError: serverError
}
