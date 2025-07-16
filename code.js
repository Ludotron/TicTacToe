let gameBoard = (
    function GameBoard() {
        //The game board is represented as an 1D array of 9 value,
        //The traslation between matrix and 1D array is :
        //matrix [a][b] = 1D [a*3+b], as the matrix is 3x3.
        const X = "X";
        const O = "O";
        const nil = "";
        const board = [nil, nil, nil, nil, nil, nil, nil, nil, nil];

        function log() {
            let result = "";
            for (let i in board) {
                if (board[i] === X) {
                    result += " X ";
                }
                if (board[i] === O) {
                    result += " O ";
                }
                if (board[i] === nil) {
                    result += " . ";
                }
                if (i % 3 === 2) {
                    result += "\n";
                }
            }
            console.log(result);
        }
        function retrieve() {
            return board;
        }
        function markAt(i, j, mark) {
            //Return true on successful board marking,
            //Return false otherwise, basically when the index is already marked.
            if (board[j * 3 + i] === nil) {
                board[j * 3 + i] = mark;
                return true;
            }
            return false;
        }
        function reset() {
            for (let i in board) {
                board[i] = nil;
            }
        }
        function isFull() {
            for (let i in board) {
                if (board[i] === nil)
                    return false;
            }
            return true;
        }
        function getWinnerAndIndexes() {
            //Return an {winner, winnerIndexes} if there is a winner,
            //Return null, if there is no winner.
            let winningIndexes = [];
            //Basic hard code check as Tic Tac Toe is a 3x3 matrix with few possibilities.
            if (board[0]) {
                if (board[0] === board[3] && board[0] === board[6])
                    if (board[0] === X)
                        return { winner: X, winningIndexes: [0, 3, 6] };
                    else
                        return { winner: O, winningIndexes: [0, 3, 6] };
            }
            if (board[1]) {
                if (board[1] === board[4] && board[1] === board[7])
                    if (board[1] === X)
                        return { winner: X, winningIndexes: [1, 4, 7] };
                    else
                        return { winner: O, winningIndexes: [1, 4, 7] };
            }
            if (board[2]) {
                if (board[2] === board[5] && board[2] === board[8])
                    if (board[2] === X)
                        return { winner: X, winningIndexes: [2, 5, 8] };
                    else
                        return { winner: O, winningIndexes: [2, 5, 8] };
            }

            if (board[0]) {
                if (board[0] === board[1] && board[0] === board[2])
                    if (board[0] === X)
                        return { winner: X, winningIndexes: [0, 1, 2] };
                    else
                        return { winner: O, winningIndexes: [0, 1, 2] };
            }
            if (board[3]) {
                if (board[3] === board[4] && board[3] === board[5])
                    if (board[3] === X)
                        return { winner: X, winningIndexes: [3, 4, 5] };
                    else
                        return { winner: O, winningIndexes: [3, 4, 5] };
            }
            if (board[6]) {
                if (board[6] === board[7] && board[6] === board[8])
                    if (board[6] === X)
                        return { winner: X, winningIndexes: [6, 7, 8] };
                    else
                        return { winner: O, winningIndexes: [6, 7, 8] };
            }

            if (board[0]) {
                if (board[0] === board[4] && board[0] === board[8])
                    if (board[0] === X)
                        return { winner: X, winningIndexes: [0, 4, 8] };
                    else
                        return { winner: O, winningIndexes: [0, 4, 8] };
            }
            if (board[2]) {
                if (board[2] === board[4] && board[2] === board[6])
                    if (board[2] === X)
                        return { winner: X, winningIndexes: [2, 4, 6] };
                    else
                        return { winner: O, winningIndexes: [2, 4, 6] };
            }
            return null;
        }

        return {
            X,
            O,
            log,
            retrieve,
            markAt,
            reset,
            isFull,
            getWinnerAndIndexes
        }
    }
)();

let gameController = (
    function GameController() {
        let playerX;
        let playerO;
        const TIE = "tie";
        const FINISHED = "finished";
        const PLAYING = "playing";
        let state;
        let currentPlayer;

        function createPlayer(name) {
            let mark;

            if (playerX && playerO)
                return null;
            else {
                function playAt(i, j) {
                    if (state === PLAYING) {
                        console.log(name + " plays with " + mark + " at " + i + "-" + j);
                        return (gameBoard.markAt(i, j, mark));
                    } else {
                        console.log("the game ended.");
                    }
                };

                if (!playerX) {
                    //Creating the playerX here :
                    mark = gameBoard.X;
                    playerX = { name, playAt };
                    return playerX;
                } else {
                    //Creating the playerO here :
                    mark = gameBoard.O;
                    playerO = { name, playAt };
                    return playerO;
                }
            }
        }

        //Switch alternatively between playerX and playerO, if state=PLAYING.
        function switchPlayer() {
            if (state === PLAYING) {
                if (currentPlayer === playerX)
                    currentPlayer = playerO;
                else if (currentPlayer === playerO)
                    currentPlayer = playerX;
            }
        }
        function currentPlayerPlaysAtIndex(k) {
            let i = (k % 3);
            let j = Math.floor(k / 3);
            if (currentPlayer.playAt(i, j)) {
                //If true the play happened correctly, else false.
                checkVictory();
                if (state === PLAYING) {
                    switchPlayer();
                }
            }
        }
        function start() {
            if (playerX && playerO) {
                currentPlayer = playerX;
            }
            domController.show();
            state = PLAYING;
        }
        function reset() {
            playerX = undefined;
            playerO = undefined;
            gameBoard.reset();
            domController.reset();
            domController.resetResult();
        }

        function checkVictory() {
            let w = gameBoard.getWinnerAndIndexes();
            if (w) {
                let { winner, winningIndexes } = w;
                if (winner === gameBoard.X) {
                    state = FINISHED;
                    //Do PlayerX's victory stuff :
                    domController.showResult(playerX.name);
                    domController.highlightWinningIndexes(winningIndexes);
                    return;
                }
                else {
                    state = FINISHED;
                    //Do PlayerX's victory stuff :
                    domController.showResult(playerO.name);
                    domController.highlightWinningIndexes(winningIndexes);
                    return;
                }
            } else {
                if (gameBoard.isFull()) {
                    state = FINISHED;
                    //Do PlayerX's victory stuff :
                    domController.showResult();
                    return;
                }
            }
        }
        function isPlaying() {
            if (state === PLAYING)
                return true;
            else
                return false;
        }
        return {
            createPlayer,
            currentPlayerPlaysAtIndex,
            start,
            reset,
            checkVictory,
            isPlaying
        }
    }
)();

//DOM Manager
let domController = (
    function DomController() {
        //The job is to build the DOM tree into the wabpage.
        //And to handle the click event that allow player to play.

        const gameArea = document.querySelector(".game-board");
        gameArea.addEventListener("click", handleClick);
        function handleClick(event) {
            if (gameController.isPlaying()) {
                gameController.currentPlayerPlaysAtIndex(event.target.dataset.index);
                update();
            }
        }
        function reset() {
            gameArea.innerText = "";   
        }
        function show() {
            let gb = gameBoard.retrieve();
            for (let i in gb) {
                let d = document.createElement("div");
                d.classList.add("one-square");
                d.dataset.index = i;
                d.innerText = gb[i];
                gameArea.appendChild(d);
            }
        }
        function update() {
            reset();
            show();
        }
        const gameResult = document.querySelector(".game-result");
        function showResult (victoriousPlayer = null) {
            //If the parameters are null, that means it's a tie.
            if (victoriousPlayer) {
                gameResult.innerText = victoriousPlayer + " wins!";
            } else {
                gameResult.innerText = "It's a tie!";
            }
        }
        function resetResult () {
            gameResult.innerText = "";
        }
        function highlightWinningIndexes (indexes) {
            let squares = document.querySelectorAll(".one-square");
            for (let s of squares) {
                console.log(s);
                for (let i of indexes) {
                    if (s.dataset.index == i) {
                        s.classList.remove("one-square");
                        s.classList.add("one-highlighted-square");
                    }
                }
            }
        }
        const gameControlNameX = document.querySelector("#player-x-name");
        const gameControlNameO = document.querySelector("#player-o-name");
        const gameControlStart = document.querySelector(".game-control-start");
        gameControlStart.addEventListener("click", handleStart);
        function handleStart (event) {
            if (gameControlNameX.value && gameControlNameO.value) {
                gameController.reset();
                gameController.createPlayer(gameControlNameX.value);
                gameController.createPlayer(gameControlNameO.value);
                gameController.start();
            }
        }
        return {
            reset,
            show,
            update,
            showResult,
            resetResult,
            highlightWinningIndexes
        }
    }
)();