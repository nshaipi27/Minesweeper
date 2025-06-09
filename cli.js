// Controller
const readlineSync = require('readline-sync');
const PlayerModel = require('./models/playerModel'); 
const ReportModel = require('./models/reportModel');
const GamePlay = require ('./models/gamePlayModel');
const GameDefinition = require ('./models/gameDefinitionModel');


while (true) {
    var userChoice = readlineSync.question("What action would you like to perform? \n 1. add player \n 2. add game \n 3. describe a game \n 4. generate a report \n 5. quit \n");

    if (userChoice == 1) {
        var playerName = readlineSync.question("What is the player's name? ");
        var playerEmail = readlineSync.question("What is the player's email? ");
        var player = new PlayerModel();
        player.createPlayer(playerName, playerEmail);
    } else if (userChoice == 2) {
        var gameName = readlineSync.question("What is the game's name? ");
        var gameDescription = readlineSync.question("What is the game's description? ");
        var gameDifficulty = readlineSync.question("What is the game's difficulty? ");
        var game = new GameDefinition();
        game.createGameDefinition(gameName, gameDescription, gameDifficulty);
    } else if (userChoice == 3) {
        var game = new GameDefinition();
        game.getAllGameDef();
        var game_definition_id = readlineSync.question("What is the game's id? ");
        var player_id = readlineSync.question("What is the player's id? ");
        var score = readlineSync.question("What is the player's score? ");
        var outcome = readlineSync.question("What is the player's outcome?(Win/Lose)");
        var gamePlay = new GamePlay();
        gamePlay.createGamePlay(game_definition_id, player_id, score, outcome);
    } else if (userChoice == 4) {
        var secondChoice = readlineSync.question("What report would you like to generate? \n 1. Number of games \n 2. Number of players \n 3. Average games per player \n 4. Top score \n 5. Average score \n 6. Average score per player \n");

        if (secondChoice == 1) {
            var report = new ReportModel();
            console.log(report.getNumberGames());
        } else if (secondChoice == 2) {
            var report = new ReportModel();
            console.log(report.getNumberPlayers());
        } else if (secondChoice == 3) {
            var report = new ReportModel();
            console.log(report.getAverageGamesPerPlayer());
        } else if (secondChoice == 4) {
            var report = new ReportModel();
            console.log(report.getTopScore());
        } else if (secondChoice == 5) {
            var report = new ReportModel();
            console.log(report.getAverageScore());
        } else if (secondChoice == 6) {
            var player = new PlayerModel();
            console.log(player.getAllPlayers());
            var player_id = readlineSync.question("Select the player's id: ");
            var report = new ReportModel();
            console.log(report.getAverageScorePlayer(player_id));
        } else {
            console.log("Invalid choice");
        }
    } else if (userChoice == 5){
        console.log("Goodbye!");
        break;
    } else {
        console.log("Invalid choice");
    }

    var continueChoice = readlineSync.question("Press any key to continue or 'q' to quit: ");
    if (continueChoice === 'q') {
        console.log("Goodbye!");
        break;
    }
}