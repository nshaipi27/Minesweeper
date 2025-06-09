const assert = require("assert");
const PlayerModel = require("../models/playerModel");

const { connectTestDatabase } = require("../test-database");

describe("PlayerModel (Database Tests)", function () {
  let db;
  let playerModel;
  beforeEach(function () {
    // Create in-memory DB
    db = connectTestDatabase();
    // Inject into PlayerModel
    playerModel = new PlayerModel(db);
    db.prepare("DELETE FROM players").run();
  });


  afterEach(function () {
    // Clean up / Close DB
    db.close();
  });

  it("should create a new player", function () {
    const username = "testuser_" + Date.now();
    const email = "test_" + Date.now() + "@example.com";

    const result = playerModel.createPlayer(username, email);

    assert.ok(result.player_id, "Player should have an id");
    assert.strictEqual(result.username, username);
    assert.strictEqual(result.email, email);

    const playersInDB = db.prepare("SELECT * FROM players").all();

    const row = db
      .prepare("SELECT * FROM players WHERE player_id = ?")
      .get(result.player_id);

    assert.ok(row, "Player row should exist in the database");
    assert.strictEqual(row.username, username);
    assert.strictEqual(row.email, email);
  });

  it("should get the player by email", function () {
    const username = "testuser_" + Date.now();
    const email = "test_" + Date.now() + "@example.com";
    const result = playerModel.createPlayer(username, email);

    const resultId = playerModel.getPlayerByEmail(email);
    assert.ok(resultId, "Player Id should exist in the database");

    assert.strictEqual(resultId, result.player_id);
  });

  it("should get all players", async function () {
    const result = [];

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < 3; i++) {
      const timestamp = Date.now();
      const unique = Math.floor(Math.random() * 10000);
      const username = `testuser_${timestamp}_${unique}`;
      const email = `test_${timestamp}_${unique}@example.com`;
      const player = await playerModel.createPlayer(username, email);
      result.push(player);
    }

    const actual = await playerModel.getAllPlayers();
    const expectedUsernames = result.map((p) => p.username);
    const actualUsernames = actual.map((p) => p.username);

    assert.deepStrictEqual(actualUsernames, expectedUsernames);
  });
});
