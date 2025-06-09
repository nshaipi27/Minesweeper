const express = require("express");
const PlayerModel = require("../models/playerModel");
const GamePlayModel = require("../models/gamePlayModel");

const router = express.Router();
const { connectToDatabase } = require("../database");
const db = connectToDatabase();
let options = ["Rock", "Paper", "Scissors"];

router.get("/", (req, res) => {
  const playerId = req.query.playerId;
  let playerName = "Player";

  if (playerId) {
    const players = new PlayerModel(db);
    const player = players.getPlayerById(parseInt(playerId, 10));
    if (player && player.username) {
      playerName = player.username;
    }
  }

  res.render("123run", {
    options,
    score: 0,
    result: null,
    playerName,
    playerId,
  });
});

router.post("/result", (req, res) => {
  const gamePlayModel = new GamePlayModel(db);

  let score = parseInt(req.body.score, 10);
  const playerId = req.body.playerId;
  let playerName = "Player";

  if (playerId) {
    const players = new PlayerModel(db);
    const player = players.getPlayerById(parseInt(playerId, 10));
    if (player && player.username) {
      playerName = player.username;
    }
  }

  const game_definition_id = 1;
  const outcome = req.body.result;

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

  res.render("123run", {
    options,
    score: score,
    result: outcome,
    playerName,
    playerId,
  });
});

module.exports = router;
