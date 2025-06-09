const assert = require("assert");
const GameDefinition = require("../models/gameDefinitionModel");
const { connectTestDatabase } = require("../test-database");

describe("GameDefinitionModel (Database Tests)", function () {
  let db;
  let gameDefModel;

  beforeEach(function () {
    db = connectTestDatabase();
    gameDefModel = new GameDefinition(db);
    db.prepare("DELETE FROM GameDefinitions").run();
  });

  afterEach(function () {
    db.close();
  });

  it("should create a new game Def", function () {
    const name = "hola";
    const description = "hola hi hi hi";
    const difficulty = "easy";

    const result = gameDefModel.createGameDefinition(
      name,
      description,
      difficulty
    );
    assert.ok(result.id, "Game should have an id");
    assert.deepStrictEqual(result.name, name);
  });

  it("should get defintion by ID", function () {
    const name = "hola";
    const description = "hola hi hi hi";
    const difficulty = "easy";

    const result = gameDefModel.createGameDefinition(
      name,
      description,
      difficulty
    );

    const resultId = gameDefModel.getGameDefinitionById(result.id);
    assert.ok(result.id, resultId);
  });

  it("should get all players", async function () {
    const result = [];

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < 3; i++) {
      const unique = Math.floor(Math.random() * 10000);
      const name = `hola_${unique}`;
      const description = `hola_${unique}`;
      const difficulty = "Ezzzzz";
      const gameDef = await gameDefModel.createGameDefinition(
        name,
        description,
        difficulty
      );
      result.push(gameDef);
    }

    const actual = await gameDefModel.getAllGameDef();
    const expectedname = result.map((p) => p.name);
    const actualname = actual.map((p) => p.name);

    assert.deepStrictEqual(expectedname, actualname);
  });

  it("should return undefined for non-existent gameDefinition ID", function () {
    const nonExistentId = 99999;
    const result = gameDefModel.getGameDefinitionById(nonExistentId);
    assert.strictEqual(result, undefined);
  });
});
