# GAME 

How to run :
[nodemon server.js or node server.js
](https://minesweeper-d93i.onrender.com)

## Landy's Game: Rock Paper Scissors Run! ✂️

### Game Concept

In this game, the player competes against the computer in a series of Rock, Paper, Scissors matches. For each win, the player advances **+100 meters**. For each loss, they are pushed back **-50 meters**.

The goal is to reach *400 meters** within a limited number of tries based on the selected difficulty level.



### Scoring Rules

- **Win:** +100 meters  
- **Loss:** -50 meters  
- **Target Distance:** 400 meters



### 🎯 Difficulty Levels

To win, the player must reach 400 meters **within the given number of tries**.


## Nora's game:

### Description:
The player is a mouse and will play minesweeper, but with cats instead of mines! Try not to click on the cat cells or else you will be eaten. If the player wins, their score will be recorded. The score is represented as the seconds taken to complete the game.

Difficulty:
Easy (For those who know how it works)
Medium (For Beginners)


## ✅ Lab Requirements Checklist

Landy
- [x] **DB Models**: Modify models
- [x] **Express server** with route handling (`server.js`)
- [x] **POST request handling**: From Ejs forms and client-side JavaScript (Fetch API)
- [x] **Custom game page for each partner**: Available at unique routes (`/123run`)
- [x] **Player list view**: `/players` route with links to player details and create option
- [x] **Leaderboard view**: `/leaderboard` shows top players per game
- [x] **Logging to `requests.log` file**: Logs all HTTP requests

Nora
- [x] **DB Models**:Modify models
- [x] **POST request handling**: From Ejs forms and client-side JavaScript (Fetch API)
- [x] **Custom game page for each partner**: Available at unique routes (`/catsweeper`)
- [x] **Player detail view**: `/player/:id` shows profile and games played
- [x] **CLI (`cli.js`)**: can write
- [x] **Deployed on lab server**

Link to deployed app: http://139.147.9.199:3000

# Testing
## Nora: test routes

## Possible Routes:
- [x] **GET:** 123run
- [x] **POST:** 123run/result
- [x] **GET:** catsweeper
- [x] **POST:** catsweeper/result2
- [x] **GET:** index (main page) --> /
- [x] **GET:** /leaderboard
- [x] **GET:** /players
- [x] **GET:** /players/:id
- [x] **POST:** /players/start




## Landy: Database
- [x] PlayerModel
- [x] GameDefinitionModel
- [x] GamePlayModel

## How to run test
In the terminal, simply run npm test and the tests will run. You may also install nyc mocha to test for test suite coverage. 
