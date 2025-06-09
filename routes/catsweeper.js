const express = require("express");
const router = express.Router();
const GamePlayModel = require("../models/gamePlayModel");
const PlayerModel = require("../models/playerModel");
const { connectToDatabase } = require("../database");
const db = connectToDatabase();

let playerId;
let playerName;

//get the player's name from the form
router.get("/", async (req, res) => {
  playerId = req.query.playerId;
  playerName = "Player"; // Default name

  if (playerId) {
    const playerModel = new PlayerModel(db);
    playerName = playerModel.getPlayerById(playerId).username;
  }

  res.render("catsweeper", {
    score: 0,
    result: null,
    playerName,
    playerId,
  });
});

router.post("/result2", (req, res) => {
  const gamePlayModel = new GamePlayModel(db);

  let score = parseInt(req.query.score, 10);

  const playerId = req.body.playerId;
  let playerName = "Player";

  if (playerId) {
    const players = new PlayerModel(db);
    const player = players.getPlayerById(parseInt(playerId, 10));
    if (player && player.username) {
      playerName = player.username;
    }
  }

  const game_definition_id = 2;
  if (score) outcome = "win";
  else outcome = "lose";

  if (isNaN(score)) score = 0;

  if (!playerId) {
    console.error("Missing player ID ");
    return res.status(400).send("Missing player_id.");
  }
  if (!game_definition_id) {
    console.error("Missing game definition ID.");
    return res.status(400).send("Missing game_definition_id.");
  }

  const game_play_id = req.body.game_play_id;
  if (game_play_id) {
    const updatedRecord = gamePlayModel.updateGameScore(game_play_id, score);
    if (!updatedRecord) {
      console.error(
        "Failed to update game score for game_play_id:",
        game_play_id
      );
    }
  } else {
    const newRecord = gamePlayModel.createGamePlay(
      game_definition_id,
      playerId,
      score,
      outcome
    );
    if (!newRecord) {
      console.error("Failed to create a new game play record.");
    }
  }

  res.render("catsweeper", {
    score: score,
    result: outcome,
    playerName,
    playerId,
  });
});

module.exports = router;
