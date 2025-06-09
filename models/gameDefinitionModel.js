const { connectToDatabase } = require("../database");

class GameDefinition {
  constructor(db) {
    this.db = db;
  }

  createGameDefinition(name, description, difficulty) {
    const query = `INSERT INTO GameDefinitions (name, description, difficulty) VALUES (?, ?, ?)`;
    const stmt = this.db.prepare(query);
    const info = stmt.run(name, description, difficulty);
    return { id: info.lastInsertRowid, name, description, difficulty };
  }

  getGameDefinitionById(game_definition_id) {
    const query = `SELECT * FROM GameDefinitions WHERE game_definition_id = ?`;
    const stmt = this.db.prepare(query);
    const info = stmt.get(game_definition_id);
    return info;
  }

  getAllGameDef() {
    const query = `SELECT * FROM GameDefinitions`;
    const stmt = this.db.prepare(query);
    const info = stmt.all();
    return info;
  }
}

module.exports = GameDefinition;
