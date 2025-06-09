const assert = require("assert");
const GamePlayModel = require("../models/gamePlayModel");
const PlayerModel = require("../models/playerModel");
const GameDefinition = require("../models/gameDefinitionModel");
const { connectTestDatabase } = require("../test-database");

describe("GamePlayModel (Database Tests)", function () {
  let db;
  let gamePlayModel;
  let gameDefModel;
  let playerModel;

  beforeEach(function () {
    db = connectTestDatabase();
    gameDefModel = new GameDefinition(db);
    gamePlayModel = new GamePlayModel(db);
    playerModel = new PlayerModel(db);
  });

  beforeEach(function () {
    db.prepare("DELETE FROM GamePlays").run();
  });

  afterEach(function () {
    db.close();
  });

  it ("Should create a new game play", function () {
    //first game definition to create
    const name = "hola";
    const description = "hola hi hi hi";
    const difficulty = "easy";

    const gamedef = gameDefModel.createGameDefinition(
      name,
      description,
      difficulty
    );

    const username = "testuser_" + Date.now();
    const email = "test_" + Date.now() + "@example.com";

    const playa = playerModel.createPlayer(username, email);

    
    const game_definition_id = gamedef.id;
    const player_id = playa.player_id;
    const score = 100;
    const outcome = "win";
   
    const result =  gamePlayModel.createGamePlay(
      game_definition_id,
      player_id,
      score,
      outcome
    );
    assert.ok(result.id, "Game play should have an id");
  });


  it("Should update the game score", function () {
    
    const gamedef = gameDefModel.createGameDefinition("test", "test desc", "easy");
    const player = playerModel.createPlayer("player_", "player_" + "@test.com");

    const gameplay = gamePlayModel.createGamePlay(gamedef.id, player.player_id, 50, "loss");
  

    const updated = gamePlayModel.updateGameScore(gameplay.id, 150);
  
    assert.ok(updated);
    assert.strictEqual(updated.id, gameplay.id);
    assert.strictEqual(updated.updatedScore, 150);
  
    /*
    const fromDb = gamePlayModel.getGamePlayById(gameplays.id);
    assert.strictEqual(fromDb.score, 150);
    */
  });
  
  it("Should retrieve a gameplay by its ID", function () {
    const gamedef = gameDefModel.createGameDefinition("retrieve", "by ID", "medium");
    const player = playerModel.createPlayer("player_", "email_" + "@test.com");
    const gameplay = gamePlayModel.createGamePlay(gamedef.id, player.player_id, 70, "win");
  
    const result = gamePlayModel.getGamePlayById(gameplay.id);
  
    assert.ok(result);
    assert.strictEqual(result.game_definition_id, gamedef.id);
    assert.strictEqual(result.player_id, player.player_id);
    assert.strictEqual(result.score, 70);
  });
  
  it("Should retrieve the most recent gameplay by player ID", function () {
    const gamedef = gameDefModel.createGameDefinition("recent", "test recent", "hard");
    const player = playerModel.createPlayer("player_" , "email_" + "@test.com");
  
    // Insert two gameplays
    gamePlayModel.createGamePlay(gamedef.id, player.player_id, 20, "loss");
    const latest = gamePlayModel.createGamePlay(gamedef.id, player.player_id, 80, "win");
    
  
    const result = gamePlayModel.getGamePlayByaPlayer(player.player_id);
  
    assert.ok(result);
    test1=gamePlayModel.getAllGameByPlayer(player.player_id);
    assert.strictEqual(result.game_play_id, latest.id);
  });
  
  it("Should retrieve all gameplays by player ID", function () {
    const gamedef = gameDefModel.createGameDefinition("all", "player test", "easy");
    const player = playerModel.createPlayer("player_", "email_" + "@test.com");
  
    // Add multiple gameplays
    const gp1 = gamePlayModel.createGamePlay(gamedef.id, player.player_id, 40, "loss");
    const gp2 = gamePlayModel.createGamePlay(gamedef.id, player.player_id, 90, "win");
  
    const allPlays = gamePlayModel.getAllGameByPlayer(player.player_id);
  
    assert.ok(Array.isArray(allPlays));
    assert.strictEqual(allPlays.length, 2);
    const scores = allPlays.map(gp => gp.score);
    assert.deepStrictEqual(scores.sort(), [40, 90]);
  });
  
  it("Should retrieve all gameplay records", function () {
    const gamedef = gameDefModel.createGameDefinition("all games", "test", "medium");
    const player1 = playerModel.createPlayer("player1_", "p1_@test.com");
    const player2 = playerModel.createPlayer("player2_" , "p2_@test.com");
  
    // Insert some gameplays
    gamePlayModel.createGamePlay(gamedef.id, player1.player_id, 60, "win");
    gamePlayModel.createGamePlay(gamedef.id, player2.player_id, 75, "loss");
  
    const allGames = gamePlayModel.getAllGamePlays();
  
    assert.ok(Array.isArray(allGames));
    assert.ok(allGames.length >= 2); 
  });
  
  
});
