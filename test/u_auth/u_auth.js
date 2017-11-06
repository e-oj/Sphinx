/**
 * @author ChikeUdenze
 * @since 11/4/2017
 */

let bcrypt = require("bcrypt");
let jwt = Promise.promisifyAll(require("jsonwebtoken"));
let chai = require("chai");
let expect = chai.expect;
let {User} = require("../models");
let http = require("../../utils/HttpStats");
let {port, secret, authToken} = require("../../config");
let {user1, user2, user1alias, user1Email} = require("./users");
let SERVER_URL = `http://localhost:${port}`;


module.exports = describe("User", () => {
    let request = chai.request(SERVER_URL);
    context("Creating a user", () => {
        let userRes;
        it("should return user and a jwt with user's _id and username", async () => {
            userRes = await request.post("/api/u/new").send(user1);
            let {user, token} = userRes.body.result;
            let decoded = await jwt.verifyAsync(token, secret);
            let {_id, alias} = decoded;
            Object.keys(user).forEach(key => {
                if(user1[key]) expect(user1[key]).to.equal(user[key]);
            });
            expect(user1._id).to.equal(_id);
            expect(user1.alias).to.equal(alias);
        });
        it("should return an error for duplicate alias", async () => {
            try {
                userRes = await request.post("/api/u/new").send(user1alias);
                console.log(user1alias.alias);
            }
            catch(err){
                let parts = err.response.body.message.split(" ");
                expect(err.status).to.equal(http.BAD_REQUEST);
                expect(parts.indexOf("alias")).to.be.above(-1);

            }
        });
        it("should return an error for duplicate email", async () => {
            try {
                console.log(user1Email.email);
                userRes = await request.post("/api/u/new").send(user1Email);
                console.log(user1Email.email);
            }
            catch(err){
                let parts = err.response.body.message.split(" ");
                expect(err.status).to.equal(http.BAD_REQUEST);
                expect(parts.indexOf("email")).to.be.above(-1);

            }
        });
    });
});