/**
 * GamePlayModel Class
 *
 * This class helps interact with the table "GamePlayModel"
 */
const { connectToDatabase } = require("../database");

class GamePlayModel {
  /**
   * Constructor - Initializes database connection
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Check if a specific record exists in a given table
   *
   * @param {string} table - The name of the database table
   * @param {string} column - The column to search for the given ID
   * @param {number} id - The ID to check for existence
   * @returns {boolean} - Returns true if the record exists, otherwise false
   */
  checkIfExists(table, column, id) {
    try {
      if (id == null || isNaN(id)) {
        console.log("id is null");
        console.error(`Invalid ID passed: ${id}`);
        return false;
      }

      const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?`;


      const stmt = this.db.prepare(query);
      const info = stmt.get([id]);
      return info.count > 0;
    } catch (error) {
      console.error("Error checking if record exists:", error);
      console.log("eeeeeeee");
      return false;
    }
  }

  /**
   * Create a new gameplay record
   *
   * @param {number} game_definition_id - The ID of the game definition
   * @param {number} player_id - The ID of the player
   * @param {number} score - The score achieved by the player
   * @param {string} outcome - The outcome of the gameplay (e.g., win/loss)
   * @returns {object|null} - The created gameplay record or null if an error occurs
   */

  createGamePlay(game_definition_id, player_id, score, outcome) {
    const completed_at = new Date().toISOString();

    if (
      !this.checkIfExists(
        "GameDefinitions",
        "game_definition_id",
        game_definition_id
      )
    ) {
      console.error("Error: Game ID does not exist.");
      return null;
    }
    if (!this.checkIfExists("Players", "player_id", player_id)) {
      console.error("Error: Player ID does not exist.");
      return null;
    }

    const query = `INSERT INTO GamePlays (game_definition_id, player_id, score, outcome, completed_at) 
                       VALUES (?, ?, ?, ?, ?)`;
    const stmt = this.db.prepare(query);

    try {
      const info = stmt.run(
        game_definition_id,
        player_id,
        score,
        outcome,
        completed_at
      );
      return {
        id: info.lastInsertRowid,
        game_definition_id,
        player_id,
        score,
        outcome,
        completed_at,
      };
    } catch (error) {
      console.error("Error inserting into GamePlays:", error);
      return null;
    }
  }

  /**
   * Update the score of an existing gameplay record
   *
   * @param {number} game_play_id - The ID of the gameplay record to update
   * @param {number} newScore - The new score to be updated
   * @returns {object|null} - The updated gameplay record or null if an error occurs
   */
  updateGameScore(game_play_id, newScore) {
    const query = `UPDATE GamePlays SET score = ? WHERE game_play_id = ?`;
    const stmt = this.db.prepare(query);

    try {
      const info = stmt.run(newScore, game_play_id);
      if (info.changes === 0) {
        return null;
      }
      return { id: game_play_id, updatedScore: newScore };
    } catch (error) {
      console.error("Error updating score:", error);
      return null;
    }
  }

  /**
   * Retrieve a gameplay record by its ID
   *
   * @param {number} game_play_id - The ID of the gameplay record
   * @returns {object|null} - The retrieved gameplay record or null if an error occurs
   */
  getGamePlayById(game_play_id) {
    const query = "SELECT * FROM GamePlays WHERE game_play_id = ?";
    const stmt = this.db.prepare(query);

    try {
      return stmt.get(game_play_id);
    } catch (error) {
      console.error("Error fetching gameplay by ID:", error);
      return null;
    }
  }

  /**
   * Retrieve a gameplay record by a playerID the most recent one
   *
   * @param {number} player_id - The ID of the player
   * @returns {object|null} - The retrieved gameplay record or null if an error occurs
   */
  getGamePlayByaPlayer(player_id) {
    const query = `
  SELECT * FROM GamePlays
  WHERE player_id = ?
  ORDER BY completed_at DESC, game_play_id DESC
  LIMIT 1
`;
    const stmt = this.db.prepare(query);

    try {
      return stmt.get(player_id);
    } catch (error) {
      console.error("Error fetching gameplay by player ID:", error);
      return null;
    }
  }

  /**
   * Retrieve a  ALL gameplay record by a playerID
   *
   * @param {number} player_id - The ID of the player
   * @returns {object|null} - The retrieved gameply all game
   */
  getAllGameByPlayer(player_id) {
    const query = "SELECT * FROM GamePlays WHERE player_id = ? ";
    const stmt = this.db.prepare(query);

    try {
      const result = stmt.all(player_id);

      return result;
    } catch (error) {
      console.error("Error fetching gameplay by player ID:", error);
      return null;
    }
  }

  /**
   * Retrieve all gameplay records
   *
   * @returns {Array} - An array of gameplay records or an empty array if an error occurs
   */
  getAllGamePlays() {
    const query = "SELECT * FROM GamePlays";
    const stmt = this.db.prepare(query);

    try {
      return stmt.all();
    } catch (error) {
      console.error("Error fetching all gameplays:", error);
      return [];
    }
  }
}

module.exports = GamePlayModel;
