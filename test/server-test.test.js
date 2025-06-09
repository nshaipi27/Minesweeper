const request = require("supertest");
const assert = require("assert");
const app = require("../server");

// before(function(){
//  // any necessary things before testing the routes, so like maybe that is initializing tables if they are not already initialized, creating players,
// });

// after(function(){});
describe("Express Route Tests", function () {
  describe("GET /", function () {
    it("should render the home page (or return 200)", function (done) {
      request(app)
        .get("/")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe("GET /players", function () {
  it("should return a 200 status", function (done) {
    request(app)
      .get("/players")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /players/:id", function () {
  it("should return a 200 status(if player exists)", function (done) {
    request(app)
      .get("/players/1")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /leaderboard", function () {
  it("should return a 200 status", function (done) {
    request(app)
      .get("/leaderboard")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /catsweeper", function () {
  it("should return a 200 status", function (done) {
    request(app)
      .get("/catsweeper")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /123run", function () {
  it("should return a 200 status", function (done) {
    request(app)
      .get("/123run")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /123run/result", function () {
  it("should return a 200 status", function (done) {
    request(app)
      .post("/123run/result")
      .send({
        score: 100,
        playerId: 1,
        result: "win",
        game_play_id: 1,
      })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /catsweeper/result2", function () {
  it("should return a 200 status", function (done) {
    request(app)
      .post("/catsweeper/result2")
      .send({
        score: 100,
        result: "win",
        playerName: "TestPlayer", // Ensure these are properly defined
        playerId: 1,
      })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /players/start", function () {
  it("should return a 302 redirection status", function (done) {
    request(app)
      .post("/players/start")
      .send({
        username: "norashaipi",
        email: "test@gmail.com",
        game: "123run",
      })
      .expect(302) // Expecting a redirect response
      .expect("Location", /\/123run\?playerId=\d+/) // Ensure redirection URL format
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
