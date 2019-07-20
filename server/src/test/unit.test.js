const expect = require('chai').expect;
const envLoader = require('dotenv-json');

const { notFoundMsg, badRequestMsg, serverErrorMsg } = require('../main/utils/errors');

describe('models', function() {
    describe('DynamoDBUser', function() {
        let Model = require('../main/models/dynamodbuser');
        describe('#getRoles()', function() {
            it('should return the correct roles', function() {
                expect(Model.prototype.getRoles()).to.deep.equal({ user: 'user', admin: 'admin' })
            });
        });
        describe('#DynamoDBUser()', function() {
            it('should create a minimal database user object without error', function() {
                let user = {
                    id: 'mock_tim',
                    role: Model.prototype.getRoles().admin,
                    hashedPassword: 'hashaaabbbccc'
                };
                let User = new Model(user);
                expect(User).to.have.property('ID');
                expect(User.ID).to.deep.equal({ "S": user.id });
                expect(User).to.have.property('Role');
                expect(User.Role).to.deep.equal({ "S": user.role });
                expect(User).to.have.property('HashedPassword');
                expect(User.HashedPassword).to.deep.equal({ "S": user.hashedPassword });
                expect(User.getProperties()).to.deep.equal({ 
                    id: user.id,
                    role: user.role,
                    hashedPassword: user.hashedPassword,
                    firstName: null,
                    lastName: null,
                    email: null
                });
            });

            it('should create a complete database user object without error', function() {
                let user = {
                    id: 'mock_tim',
                    role: Model.prototype.getRoles().admin,
                    firstName: 'Timothy',
                    lastName: 'Mock',
                    email: 'timothy@mock.co',
                    hashedPassword: 'hashaaabbbccc'
                };
                let User = new Model(user);
                expect(User).to.have.property('ID');
                expect(User.ID).to.deep.equal({ "S": user.id });
                expect(User).to.have.property('Role');
                expect(User.Role).to.deep.equal({ "S": user.role });
                expect(User).to.have.property('FirstName');
                expect(User.FirstName).to.deep.equal({ "S": user.firstName });
                expect(User).to.have.property('LastName');
                expect(User.LastName).to.deep.equal({ "S": user.lastName });
                expect(User).to.have.property('Email');
                expect(User.Email).to.deep.equal({ "S": user.email });
                expect(User).to.have.property('HashedPassword');
                expect(User.HashedPassword).to.deep.equal({ "S": user.hashedPassword });
                expect(User.getProperties()).to.deep.equal(user);
            });

            it('should throw an error when \'id\' is missing', function() {
                let user = {
                    role: Model.prototype.getRoles().admin,
                    hashedPassword: 'hashaaabbbccc'
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, missing "id" property');
            });

            it('should throw an error when \'role\' is missing', function() {
                let user = {
                    id: 'mock_tim',
                    hashedPassword: 'hashaaabbbccc'
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, missing "role" property');
            });

            it('should throw an error when \'role\' is not a valid value', function() {
                let user = {
                    id: 'mock_tim',
                    role: 'DoAnything',
                    hashedPassword: 'hashaaabbbccc'
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, "role" propery is not an allowed value');
            });

            it('should throw an error when \'HashedPassword\' is missing', function() {
                let user = {
                    id: 'mock_tim',
                    role: Model.prototype.getRoles().admin
                };
                expect(function() { new Model(user) }).to.throw('Invalid user, missing "hashedPassword property');
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

describe('controllers', function() {
    before(function() {
        envLoader({ path: "server/config/.env.development.json"});
        process.env['IN_MEMORY_DB'] = true;
        process.env['IN_MEMORY_FS'] = true;
        console.log('Using in memory database and filesystem');
    });

    describe('auth', function() {
        let auth, mockUser, tokenExpire;
        before(function() {
            tokenExpire = 3;
            process.env['TOKEN_EXPIRE_TIME'] = tokenExpire; // set token to expire in 3 seconds
            auth = require('../main/controllers/auth');
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
                expect(loginResponse.expires_in).to.be.equal(tokenExpire);
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
                let send = errFunc(done, 'token not found/recognized');
                let res = { // create response object containing send method (only) used if error
                    send,
                    status: () => ({ send })
                };
                auth.require(mockUser.role)(req, res, () => {
                    expect(req.user).to.deep.equal({
                        id: mockUser.id,
                        role: mockUser.role,
                        firstName: mockUser.firstName,
                        lastName: mockUser.lastName,
                        email: mockUser.email
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
                auth.require(mockUser.role)(req, res, errFunc(done, 'request should have been rejected'));
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
                auth.require(mockUser.role)(req, res, errFunc(done, 'request should have been rejected'));
            });
    
            it('should reject token with incorrect user role', function(done) {
                authUtil.saveUser({
                    id: 'not_tim',
                    role: 'user', // not equal to mockUser.role
                    hashedPassword: mockUser.hashedPassword
                }).then(() => {
                    authUtil.login({
                        id: 'not_tim',
                        password: mockUser.plainPassword
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
                        auth.require(mockUser.role)(req, res, errFunc(done, 'request should have been rejected'));
                    });
                });
            });  
    
            it('should reject expired token', function(done) {
                this.timeout(10000);
                authUtil.login({
                    id: mockUser.id,
                    password: mockUser.PlainPassword
                }).then(async r => {
                    const token = r.access_token;
                    const headers = { 'Authorization': `Bearer ${token}` };
                    const req = { //create request object containing method to access Authorization token
                        get: str => headers[str]
                    };
                    const send = r => {
                        expect(r.message).to.equal('Invalid Authorization token');
                        done();
                    };
                    const res = { // create response object containing send method (only) used if error
                        send,
                        status: code => {
                            expect(code).to.equal(401);
                            return { send };
                        },
                        status: () => ({ send }),
                        setHeader: (key, value) => {
                            expect(key).to.equal('WWW-Authenticate');
                            expect(value).to.contain('error="invalid_token"');
                        }
                    };
                    const delay = () => new Promise(resolve => setTimeout(resolve, 3000));
                    await delay(); // delay to let token expire
                    auth.require(mockUser.role)(req, res, errFunc(done, 'request should have been rejected'));
                });
            });
        });
    });
    describe('posts', function() {
        let postsController;
        before(function() {
            postsController = require('../main/controllers/posts');
        });

        describe('#initPost()', function() {
            it('should generate postId, and return it with corresponding mediaPath', async function() {
                const mockSend = res => {
                    const postId = res.id;
                    expect(postId).to.exist;
                    expect(res.mediaPath).to.equal(`media/${postId}`);
                }
                (await postsController.initPost())({
                    send: mockSend
                });
            });
        });

        describe('#createPost()', function() {
            let body, testValues
            before(function() {
                testValues = require('./services/filestorage').testValues;
                body = {
                    id: testValues.postId,
                    title: 'A Post About Life',
                    category: 'life',
                    htmlBody: '<h1>Life Thoughts</h1>',
                    thumnailPath: testValues.thumnailPath,
                    mediaPaths: [testValues.imagePath],
                    published: false
                };
                user = { id: 'april' };
            });

            it('should save new post when request is valid', async function() {
                const mockStatus = code => {
                    expect(code).to.equal(204);
                    return { end: () => {}}
                }
                (await postsController.createPost({ user, body }))({ status: mockStatus });
            });
        });
    });
});

describe.skip('database', function() {
    // TODO
});

describe.skip('filestorage', function() {
    // TODO
});
