const expect = require('chai').expect;
const envLoader = require('dotenv-json');

const { notFoundMsg, badRequestMsg, serverErrorMsg } = require('../utils/errors');

describe('models', function() {
    describe('DynamoDBUser', function() {
        let Model = require('../models/dynamodbuser');
        describe('#getRoles()', function() {
            it('should return the correct roles', function() {
                expect(Model.prototype.getRoles()).to.deep.equal({ user: 'user', admin: 'admin' })
            });
        });
        describe('#DynamoDBUser()', function() {
            it('should create a minimal database user object without error', function() {
                let user = {
                    ID: 'mock_tim',
                    Role: Model.prototype.getRoles().admin,
                    HashedPassword: 'hashaaabbbccc'
                };
                let User = new Model(user);
                expect(User).to.have.property('ID');
                expect(User.ID).to.deep.equal({ "S": user.ID });
                expect(user).to.have.property('Role');
                expect(User.Role).to.deep.equal({ "S": user.Role });
                expect(User).to.have.property('HashedPassword');
                expect(User.HashedPassword).to.deep.equal({ "S": user.HashedPassword });
                expect(User.getProperties()).to.deep.equal({ 
                    ID: user.ID,
                    Role: user.Role,
                    HashedPassword: user.HashedPassword,
                    FirstName: null,
                    LastName: null,
                    Email: null
                });
            });

            it('should create a complete database user object without error', function() {
                let user = {
                    ID: 'mock_tim',
                    Role: Model.prototype.getRoles().admin,
                    FirstName: 'Timothy',
                    LastName: 'Mock',
                    Email: 'timothy@mock.co',
                    HashedPassword: 'hashaaabbbccc'
                };
                let User = new Model(user);
                expect(User).to.have.property('ID');
                expect(User.ID).to.deep.equal({ "S": user.ID });
                expect(user).to.have.property('Role');
                expect(User.Role).to.deep.equal({ "S": user.Role });
                expect(User).to.have.property('FirstName');
                expect(User.FirstName).to.deep.equal({ "S": user.FirstName });
                expect(User).to.have.property('LastName');
                expect(User.LastName).to.deep.equal({ "S": user.LastName });
                expect(User).to.have.property('Email');
                expect(User.Email).to.deep.equal({ "S": user.Email });
                expect(User).to.have.property('HashedPassword');
                expect(User.HashedPassword).to.deep.equal({ "S": user.HashedPassword });
                expect(User.getProperties()).to.deep.equal(user);
            });

            it('should throw an error when \'ID\' is missing', function() {
                let user = {
                    Role: Model.prototype.getRoles().admin,
                    HashedPassword: 'hashaaabbbccc'
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, missing "ID" property');
            });

            it('should throw an error when \'Role\' is missing', function() {
                let user = {
                    ID: 'mock_tim',
                    HashedPassword: 'hashaaabbbccc'
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, missing "Role" property');
            });

            it('should throw an error when \'Role\' is not a valid value', function() {
                let user = {
                    ID: 'mock_tim',
                    Role: 'DoAnything',
                    HashedPassword: 'hashaaabbbccc'
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, "role" propery is not an allowed value');
            });

            it('should throw an error when \'HashedPassword\' is missing', function() {
                let user = {
                    ID: 'mock_tim',
                    Role: Model.prototype.getRoles().admin
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, missing "HashedPassword property');
            });
        });
    });
});

describe.skip('database:mock', function() {
    // TODO
});

describe.skip('filestorage:mock', function() {
    // TODO
});

describe('auth', function() {
    let auth, mockUser;
    before(function() {
        envLoader({ path: ".env.development.json"});
        process.env['NODE_ENV'] = 'test';
        process.env['DATABASE'] = 'test/services/database'; // use mock database
        console.log(`Setting database to ${process.env.DATABASE}`);

        auth = require('../services/auth');
    });

    describe('#hash()', function() {
        it('should hash without error', async function() {
            let hash = await auth.hash('hello1234');
            expect(hash).to.exist;
        });
    });

    describe('#login()', function() {
        let authUtil;

        before( async function() {
            authUtil = require('./scripts/auth-utils');
            mockUser = authUtil.createMockUser(); // see auth-utils.js for mock user details
            await authUtil.saveUser(mockUser);
        });

        it('should successfully login mock user', async function() {
            let loginResponse = await authUtil.login()
            expect(loginResponse.message).to.equal('Logged in');
            expect(loginResponse).to.have.property('access_token');
            expect(loginResponse.token_type).to.equal('Bearer');
            expect(loginResponse.expires_in).to.be.greaterThan(300);
        });

        it('should reject invalid user id', async function() {
            let body = {
                id: 'NOT_mock_tim',
                password: process.env.TEST_PASSWORD
            };
            let loginResponse = await authUtil.login(body);
            expect(loginResponse.message).to.not.equal('Logged in');
            expect(loginResponse).to.not.have.property('access_token');
            expect(loginResponse).to.not.have.property('token_type');
            expect(loginResponse).to.not.have.property('expires_in');
        });

        it('should reject invalid user password', async function() {
            let body = {
                id: 'mock_tim',
                password: 'hello1234' // not env.TEST_PASSWORD
            };
            let loginResponse = await authUtil.login(body);
            expect(loginResponse.message).to.not.equal('Logged in');
            expect(loginResponse).to.not.have.property('access_token');
            expect(loginResponse).to.not.have.property('token_type');
            expect(loginResponse).to.not.have.property('expires_in');
        });
    });

    describe('#require()', function() {
        let authUtil, loginResponse, errFunc, token, headers;

        before( async function() {
            authUtil = require('./scripts/auth-utils');
            loginResponse = await authUtil.login(); // retrieve token using default user, created in previous test
            token = loginResponse.access_token;

            headers = { 'Authorization': `Bearer ${token}` };
            errFunc = (done, msg) => () => { done(new Error(msg)) };
        });

        it('should accept valid token, and place user details in request object', function(done) {
            let req = { //create request object containing method to access Authorization token
                get: str => headers[str]
            };
            let send = errFunc(done, 'token not found/recognized')
            let res = { // create response object containing send method (only) used if error
                send,
                status: () => ({ send })
            };
            auth.require(mockUser.Role)(req, res, () => {
                expect(req.user).to.deep.equal({
                    ID: mockUser.ID,
                    Role: mockUser.Role,
                    FirstName: mockUser.FirstName,
                    LastName: mockUser.LastName,
                    Email: mockUser.Email
                });
                done();
            });
        });

        it('should reject request with missing authorization', function(done) {
            let req = { //create request object containing method to access Authorization token
                get: () => undefined
            };
            let send = r => {
                expect(r.message).to.equal(notFoundMsg);
                done();
            };
            let res = { // create response object containing send method
                send,
                status: code => {
                    expect(code).to.equal(404);
                    return { send };
                }
            };
            auth.require(mockUser.Role)(req, res, errFunc(done, 'request should have been rejected'));
        });

        it('should reject invalid token', function(done) {
            let headers = { 'Authorization': 'Bearer letmein' };
            let req = { //create request object containing method to access Authorization token
                get: str => headers[str]
            };
            let send = r => {
                expect(r.message).to.equal('Invalid Authorization token');
                done();
            };
            let res = {
                send,
                status: code => {
                    expect(code).to.equal(401);
                    return { send };
                },
                setHeader: (key, value) => {
                    expect(key).to.equal('WWW-Authenticate');
                    expect(value).to.contain('error="invalid_token"');
                }
            };
            auth.require(mockUser.Role)(req, res, errFunc(done, 'request should have been rejected'));
        });

        it('should reject token with incorrect user role', function(done) {
            authUtil.saveUser({
                ID: 'not_tim',
                Role: 'user', // not equal to mockUser.Role
                HashedPassword: mockUser.HashedPassword
            }).then(() => {
                authUtil.login({
                    id: 'not_tim',
                    password: mockUser.PlainPassword
                }).then(r => {
                    let token = r.access_token;

                    let headers = { 'Authorization': `Bearer ${token}` };
                    let req = { //create request object containing method to access Authorization token
                        get: str => headers[str]
                    };
                    let send = r => {
                        expect(r.message).to.equal('User identified by authorization token has incorrect role');
                        done();
                    };
                    let res = {
                        send,
                        status: code => {
                            expect(code).to.equal(403);
                            return { send };
                        },
                        setHeader: (key, value) => {
                            expect(key).to.equal('WWW-Authenticate');
                            expect(value).to.contain('error="insufficient_scope"');

                        }
                    };
                    auth.require(mockUser.Role)(req, res, errFunc(done, 'request should have been rejected'));
                });
            });
        });  

        it('should reject expired token');
    });

});

describe.skip('database', function() {
    // TODO
});

describe.skip('filestorage', function() {
    // TODO
});
