const expect = require('chai').expect;
const envLoader = require('dotenv-json');

const {
    notFoundMsg,
    badRequestMsg,
    serverErrorMsg
} = require('../main/utils/errors');

describe('models', function () {
    describe('DynamoDBPost', function () {
        const Model = require('../main/models/DynamoDBPost');

        describe('#getCategories()', function () {
            it('should return the correct categories', function () {
                expect(Model.prototype.getCategories()).to.deep.equal([{
                        id: 'life',
                        label: 'Life'
                    },
                    {
                        id: 'food',
                        label: 'Food'
                    },
                    {
                        id: 'inspiration',
                        label: 'Inspiration'
                    }
                ]);
            });
        });

        describe('#DynamoDBPost()', function () {
            let post;
            beforeEach(function () {
                post = {
                    id: 'id',
                    title: 'A Post About Life',
                    author: 'april',
                    createdTime: 123456789,
                    category: Model.prototype.getCategories()[0].id,
                    published: true,
                    thumnailPath: 'media/id/image.jpg',
                    bodyPath: 'posts/id.html',
                    mediaPaths: ['media/id/image.jpg'],
                };
            });

            it('should create a database post object without error', function () {
                const Post = new Model(post);
                expect(Post).to.have.property('ID');
                expect(Post.ID).to.deep.equal({
                    "S": post.id
                });
                expect(Post).to.have.property('Author');
                expect(Post.Author).to.deep.equal({
                    "S": post.author
                });
                expect(Post).to.have.property('Title');
                expect(Post.Title).to.deep.equal({
                    "S": post.title
                });
                expect(Post).to.have.property('CreatedTime');
                expect(Post.CreatedTime).to.deep.equal({
                    "N": `${post.createdTime}`
                });
                expect(Post).to.have.property('Category');
                expect(Post.Category).to.deep.equal({
                    "S": post.category
                });
                expect(Post).to.have.property('Published');
                expect(Post.Published).to.deep.equal({
                    "BOOL": post.published
                });
                expect(Post).to.have.property('ThumnailPath');
                expect(Post.ThumnailPath).to.deep.equal({
                    "S": post.thumnailPath
                });
                expect(Post).to.have.property('BodyPath');
                expect(Post.BodyPath).to.deep.equal({
                    "S": post.bodyPath
                });
                expect(Post).to.have.property('MediaPaths');
                expect(Post.MediaPaths).to.deep.equal({
                    "S": JSON.stringify(post.mediaPaths)
                });
            });

            it('should throw an error when \'id\' is missing', function () {
                post.id = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "id" property');
            });

            it('should throw an error when \'author\' is missing', function () {
                post.author = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "author" property');
            });

            it('should throw an error when \'title\' is missing', function () {
                post.title = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "title" property');
            });

            it('should throw an error when \'createdTime\' is missing', function () {
                post.createdTime = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "createdTime" property');
            });

            it('should throw an error when \'category\' is missing', function () {
                post.category = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "category" property');
            });

            it('should throw an error when category is invalid', function () {
                post.category = 'something else';
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, category is in-valid');
            });

            it('should throw error when thumnailPath is missing', function () {
                post.thumnailPath = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "thumnailPath" property');
            });

            it('should throw error when bodyPath is missing', function () {
                post.bodyPath = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "bodyPath" property');
            });

            it('should throw error when mediaPaths is missing', function () {
                post.mediaPaths = undefined;
                expect(() => {
                    new Model(post)
                }).to.throw('Invalid post, missing "mediaPaths" property');
            });
        });
    });

    describe('DynamoDBUser', function () {
        const Model = require('../main/models/dynamodbuser');

        describe('#getRoles()', function () {
            it('should return the correct roles', function () {
                expect(Model.prototype.getRoles()).to.deep.equal({
                    user: 'user',
                    admin: 'admin'
                })
            });
        });

        describe('#DynamoDBUser()', function () {
            it('should create a minimal database user object without error', function () {
                let user = {
                    id: 'mock_tim',
                    role: Model.prototype.getRoles().admin,
                    hashedPassword: 'hashaaabbbccc'
                };
                let User = new Model(user);
                expect(User).to.have.property('ID');
                expect(User.ID).to.deep.equal({
                    "S": user.id
                });
                expect(User).to.have.property('Role');
                expect(User.Role).to.deep.equal({
                    "S": user.role
                });
                expect(User).to.have.property('HashedPassword');
                expect(User.HashedPassword).to.deep.equal({
                    "S": user.hashedPassword
                });
                expect(User.getProperties()).to.deep.equal({
                    id: user.id,
                    role: user.role,
                    hashedPassword: user.hashedPassword,
                    firstName: null,
                    lastName: null,
                    email: null
                });
            });

            it('should create a complete database user object without error', function () {
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
                expect(User.ID).to.deep.equal({
                    "S": user.id
                });
                expect(User).to.have.property('Role');
                expect(User.Role).to.deep.equal({
                    "S": user.role
                });
                expect(User).to.have.property('FirstName');
                expect(User.FirstName).to.deep.equal({
                    "S": user.firstName
                });
                expect(User).to.have.property('LastName');
                expect(User.LastName).to.deep.equal({
                    "S": user.lastName
                });
                expect(User).to.have.property('Email');
                expect(User.Email).to.deep.equal({
                    "S": user.email
                });
                expect(User).to.have.property('HashedPassword');
                expect(User.HashedPassword).to.deep.equal({
                    "S": user.hashedPassword
                });
                expect(User.getProperties()).to.deep.equal(user);
            });

            it('should throw an error when \'id\' is missing', function () {
                let user = {
                    role: Model.prototype.getRoles().admin,
                    hashedPassword: 'hashaaabbbccc'
                };
                expect(function () {
                    new Model(user)
                }).to.throw('Invalid user, missing "id" property');
            });

            it('should throw an error when \'role\' is missing', function () {
                let user = {
                    id: 'mock_tim',
                    hashedPassword: 'hashaaabbbccc'
                };
                expect(function () {
                    new Model(user)
                }).to.throw('Invalid user, missing "role" property');
            });

            it('should throw an error when \'role\' is not a valid value', function () {
                let user = {
                    id: 'mock_tim',
                    role: 'DoAnything',
                    hashedPassword: 'hashaaabbbccc'
                };
                expect(function () {
                    new Model(user)
                }).to.throw('Invalid user, "role" propery is not an allowed value');
            });

            it('should throw an error when \'HashedPassword\' is missing', function () {
                let user = {
                    id: 'mock_tim',
                    role: Model.prototype.getRoles().admin
                };
                expect(function () {
                    new Model(user)
                }).to.throw('Invalid user, missing "hashedPassword property');
            });
        });
    });
});

describe.skip('database:mock', function () {
    // TODO
});

describe.skip('filestorage:mock', function () {
    // TODO
});

describe('controllers', function () {
    before(function () {
        envLoader({
            path: "server/config/.env.development.json"
        });
        process.env['IN_MEMORY_DB'] = true;
        process.env['IN_MEMORY_FS'] = true;
        console.log('Using in memory database and filesystem');
    });

    describe('auth', function () {
        let auth, mockUser, tokenExpire;
        before(function () {
            tokenExpire = 3;
            process.env['TOKEN_EXPIRE_TIME'] = tokenExpire; // set token to expire in 3 seconds
            auth = require('../main/controllers/auth');
        });

        describe('#hash()', function () {
            it('should hash without error', async function () {
                let hash = await auth.hash('hello1234');
                expect(hash).to.exist;
            });
        });

        describe('#login()', function () {
            let authUtil;

            before(async function () {
                authUtil = require('./scripts/auth-utils');
                mockUser = authUtil.createMockUser(); // see auth-utils.js for mock user details
                await authUtil.saveUser(mockUser);
            });

            it('should successfully login mock user', async function () {
                let loginResponse = await authUtil.login()
                expect(loginResponse.message).to.equal('Logged in');
                expect(loginResponse).to.have.property('access_token');
                expect(loginResponse.token_type).to.equal('Bearer');
                expect(loginResponse.expires_in).to.be.equal(tokenExpire);
            });

            it('should reject invalid user id', async function () {
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

            it('should reject invalid user password', async function () {
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

        describe('#require()', function () {
            let authUtil, loginResponse, errFunc, token, headers;

            before(async function () {
                authUtil = require('./scripts/auth-utils');
                loginResponse = await authUtil.login(); // retrieve token using default user, created in previous test
                token = loginResponse.access_token;

                headers = {
                    'Authorization': `Bearer ${token}`
                };
                errFunc = (done, msg) => () => {
                    done(new Error(msg))
                };
            });

            it('should accept valid token, and place user details in request object', function (done) {
                let req = { //create request object containing method to access Authorization token
                    get: str => headers[str]
                };
                let send = errFunc(done, 'token not found/recognized');
                let res = { // create response object containing send method (only) used if error
                    send,
                    status: () => ({
                        send
                    })
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

            it('should reject request with missing authorization', function (done) {
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
                        return {
                            send
                        };
                    }
                };
                auth.require(mockUser.role)(req, res, errFunc(done, 'request should have been rejected'));
            });

            it('should reject invalid token', function (done) {
                let headers = {
                    'Authorization': 'Bearer letmein'
                };
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
                        return {
                            send
                        };
                    },
                    setHeader: (key, value) => {
                        expect(key).to.equal('WWW-Authenticate');
                        expect(value).to.contain('error="invalid_token"');
                    }
                };
                auth.require(mockUser.role)(req, res, errFunc(done, 'request should have been rejected'));
            });

            it('should reject token with incorrect user role', function (done) {
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

                        let headers = {
                            'Authorization': `Bearer ${token}`
                        };
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
                                return {
                                    send
                                };
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

            it('should reject expired token', function (done) {
                this.timeout(10000);
                authUtil.login({
                    id: mockUser.id,
                    password: mockUser.PlainPassword
                }).then(async r => {
                    const token = r.access_token;
                    const headers = {
                        'Authorization': `Bearer ${token}`
                    };
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
                            return {
                                send
                            };
                        },
                        status: () => ({
                            send
                        }),
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
    describe('posts', function () {
        let postsController;
        before(function () {
            postsController = require('../main/controllers/posts');
        });

        describe('#initPost()', function () {
            it('should generate postId, and return it with corresponding mediaPath', async function () {
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

        describe('#createPost()', function () {
            let body, testValues
            before(function () {
                testValues = require('./services/filestorage').testValues;
            });
            beforeEach(function () {
                body = {
                    id: testValues.postId,
                    title: 'A Post About Life',
                    category: 'life',
                    htmlBody: '<h1>Life Thoughts</h1>',
                    thumnail: testValues.thumnail,
                    media: [testValues.image],
                    published: false
                };
                user = {
                    id: 'april'
                };
            });

            it('should save new post when request is valid', async function () {
                const mockStatus = code => {
                        expect(code).to.equal(204);
                        return {
                            end: () => {}
                        }
                    }
                    (await postsController.createPost({
                        user,
                        body
                    }))({
                        status: mockStatus
                    });
            });

            it('should fail when htmlBody is missing', async function () {
                const mockStatus = code => {
                    expect(code).to.equal(400);
                    return {
                        send: () => {}
                    }
                };
                body.htmlBody = null;
                (await postsController.createPost({
                    user,
                    body
                }))({
                    status: mockStatus
                });
            });

            it('should fail when one of the media files is missing', async function () {
                const mockStatus = code => {
                    expect(code).to.equal(400);
                    return {
                        send: () => {}
                    }
                };
                body.media = ['other.jpg'];
                (await postsController.createPost({
                    user,
                    body
                }))({
                    status: mockStatus
                });
            });

            it('should fail when the thumnail file is missing', async function () {
                const mockStatus = code => {
                    expect(code).to.equal(400);
                    return {
                        send: () => {}
                    }
                };
                body.thumnail = 'other.jpg';
                (await postsController.createPost({
                    user,
                    body
                }))({
                    status: mockStatus
                });
            });
        });
    });
});

describe.skip('database', function () {
    // TODO
});

describe.skip('filestorage', function () {
    // TODO
});