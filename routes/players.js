const express = require("express");
const router = express.Router();
const PlayerModel = require("../models/playerModel");
const GamePlayModel = require("../models/gamePlayModel");
const { connectToDatabase } = require("../database");
const db = connectToDatabase();
const playerModel = new PlayerModel(db);
const gameModel = new GamePlayModel(db);

/**
 *
 * Route: GET /players because our route is already player
 *
 */
router.get("/", (req, res) => {
  try {
    const allPlayers = playerModel.getAllPlayers();

    res.render("players", { players: allPlayers });
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).send("Error fetching players");
  }
});

/**
 * Player Detail View
 * Smame for here ->
 */

router.get("/:id", async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await playerModel.getPlayerById(playerId);

    if (!player) {
      return res.status(404).send("Player not found.");
    }

    const games = await gameModel.getAllGameByPlayer(playerId);

    res.render("id", { player, games });
  } catch (error) {
    console.error("Error fetching player details:", error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Create New Player and Start Game
 */
router.post("/start", (req, res) => {
  const { username, email, game } = req.body;

  try {
    let player_id;

    const existingPlayer = playerModel.getPlayerByEmail(email);
    if (existingPlayer != null) {
      player_id = existingPlayer;
    } else {
      const newPlayer = playerModel.createPlayer(username, email);
      player_id = newPlayer.player_id;
    }

    if (game === "123run") {
      res.redirect(`/123run?playerId=${player_id}`);
    } else if (game === "catsweeper") {
      res.redirect(`/catsweeper?playerId=${player_id}`);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error creating new player:", error);
    res.status(500).send("Failed to create player");
  }
});

module.exports = router;
