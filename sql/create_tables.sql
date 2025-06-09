CREATE TABLE IF NOT EXISTS Players (
player_id INTEGER PRIMARY KEY,
username TEXT NOT NULL UNIQUE,
email TEXT NOT NULL UNIQUE,
created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS GamePlays (
    game_play_id INTEGER PRIMARY KEY,
    game_definition_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    outcome TEXT NOT NULL,
    completed_at TEXT NOT NULL,
    FOREIGN KEY (game_definition_id) REFERENCES GameDefinitions (game_definition_id),
    FOREIGN KEY (player_id) REFERENCES Players (player_id)
);


CREATE TABLE IF NOT EXISTS GameDefinitions ( 
    game_definition_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL UNIQUE, 
    difficulty INTEGER NOT NULL
);