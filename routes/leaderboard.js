const express = require("express");
const router = express.Router();
const PlayerModel = require("../models/playerModel");
const GamePlayModel = require("../models/gamePlayModel");
const { connectToDatabase } = require("../database");
const db = connectToDatabase();
const players = new PlayerModel(db);
const gamePlayers = new GamePlayModel(db);

const allPlayers = players.getAllPlayers();
console.log("all thep layer", allPlayers);

/**
 * example:
 *  player_id: 24,
    username: 'jfslf',
    email: 'tia@gmail',
    created_at: '2025-03-21T15:58:08.642Z'
  }
--> i need to get that id and get the score
getGamePlayByaPlayer(player_id); from that
 */

router.get("/", async (req, res) => {
  try {
    let game = req.query.game;
 

    // ⬅️need to wait
    const allPlayers = await players.getAllPlayers();
    let filteredPlayers;

    if (game) {
      const gameMapping = { "123run": 1, "minesweeper": 2 };
      const gameDefId = gameMapping[game];

      filteredPlayers = [];

      for (let player of allPlayers) {
        const gameplayRecord = await gamePlayers.getGamePlayByaPlayer(player.player_id);
        if (gameplayRecord && gameplayRecord.game_definition_id === gameDefId) {
          player.score = gameplayRecord.score;
          filteredPlayers.push(player);
        }
      }
    } else {
      filteredPlayers = [];

      for (let player of allPlayers) {
        const gameplayRecord = await gamePlayers.getGamePlayByaPlayer(player.player_id);
        player.score = gameplayRecord ? gameplayRecord.score : 0;
        filteredPlayers.push(player);
      }
    }

    filteredPlayers.sort((a, b) => b.score - a.score);
    res.render("leaderboard", { allPlayers: filteredPlayers });

  } catch (error) {
    console.error("Error loading leaderboard:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
