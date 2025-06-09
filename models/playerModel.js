/**
 * PlayerModel Class
 *
 * This class has methods to interact with table " players"
 */

const { connectToDatabase } = require("../database");

// this is for normal const { connectToDatabase } = require("../database");

//testing
//const { connectTestDatabase } = require("../test-database");

class PlayerModel {
  /**
   * Constructor - Initializes database connection, db injection
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Create a new player record in the database
   *
   * @param {string} username - The username of the player
   * @param {string} email - The email address of the player
   * @returns {object} - The newly created player record
   */
  createPlayer(username, email) {
    const createdAt = new Date().toISOString();
    const query =
      "INSERT INTO Players (username, email, created_at) VALUES (?, ?, ?)";

    const stmt = this.db.prepare(query);
    const info = stmt.run(username, email, createdAt);
    return {
      player_id: info.lastInsertRowid,
      username,
      email,
      created_at: createdAt,
    };
  }

  /**
   * Retrieve a player's information by their unique ID
   *
   * @param {number} player_id - The ID of the player to retrieve
   * @returns {object|null} - The player's record or null if not found
   */
  getPlayerById(player_id) {
    const query = "SELECT * FROM players WHERE player_id = ?";
    const stmt = this.db.prepare(query);
    const info = stmt.get(player_id);
    return info;
  }

  /**
   * Check if a player exists by email.
   *
   * @param {string} email - The email
   * @returns {number|null} - Returns the player_id if found, otherwise null.
   */
  getPlayerByEmail(email) {
    try {
      const query = "SELECT player_id FROM players WHERE email = ?";
      const stmt = this.db.prepare(query);
      const info = stmt.get(email);

      return info && info.player_id ? info.player_id : null;
    } catch (error) {
      console.error("Error in getPlayerByEmail:", error);
      return null;
    }
  }

  /**
   * Retrieve all players from the database
   *
   * @returns {Array} - An array containing all player records
   */
  getAllPlayers() {
  
    const query = "SELECT * FROM Players ORDER BY player_id ASC";
    const stmt = this.db.prepare(query);
    const info = stmt.all();
    return info;
  }
}

module.exports = PlayerModel;
