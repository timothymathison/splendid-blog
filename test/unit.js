const expect = require('chai').expect;
const envLoader = require('dotenv-json');

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

            it('should throw an error when \'ID\' is missing'); // TODO

            it('should throw an error when \'Role\' is missing'); // TODO

            it('should throw an error when \'HashedPassword\' is missing'); // TODO
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
    let auth;
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
        let tokenGenerator, mockUser;

        before( async function() {
            tokenGenerator = require('./scripts/generatetoken');
            mockUser = tokenGenerator.createMockUser(); // see generatetoken.js for mock user details
            await tokenGenerator.saveUser(mockUser);
        });

        it('should successfully login mock user', async function() {
            let loginResponse = await tokenGenerator.testLogin()
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
            let loginResponse = await tokenGenerator.testLogin(body);
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
            let loginResponse = await tokenGenerator.testLogin(body);
            expect(loginResponse.message).to.not.equal('Logged in');
            expect(loginResponse).to.not.have.property('access_token');
            expect(loginResponse).to.not.have.property('token_type');
            expect(loginResponse).to.not.have.property('expires_in');
        });
    });

    describe.skip('#require()', function() {
        // TODO
    });

});

describe.skip('database', function() {
    // TODO
});

describe.skip('filestorage', function() {
    // TODO
});
