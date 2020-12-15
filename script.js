function resetBottonClick(event){
  event.stopImmediatePropagation();
  event.stopPropagation();
  location.reload();
}

function grid_item_click(event) {
  event.stopImmediatePropagation();
  event.stopPropagation();

  if (gameBoard.getVictor() == "") {
    gameBoard.set_mark(event);
    gameBoard.checkForGameOver();
    gameBoard.checkForGameDraw();
    gameBoard.manageTurns();
    //return;
  }
  //
  
  console.log("isGameOver: "+gameBoard.isGameOver());
}

const gameBoard = (() => {
  let playerX;
  let playerO;
  let gameBoard_state = [];
  let currentPlayer;
  let gameBoardTurnError = false;
  let victor = "";
  let gameOver = false;

  const checkForGameDraw = () => {
    if (!spaceLeft() && gameBoard.getVictor() == "") {
      gameBoardTurnError = true;
      gameOver = true;
      victor = "It's a draw!!";

      //alert(victor);
      //output to html
      outputMessage(victor);

      return;
    }
  };

  const spaceLeft = () => {
    console.log("space left: " + gameBoard_state.includes(""));
    return gameBoard_state.includes("");
  };

  const isGameOver = () => gameOver;

  const getVictor = () => victor;

  const manageTurns = () => {
    if (!gameBoardTurnError && victor == "") {
      if (currentPlayer === playerX) {
        currentPlayer = playerO;
        //output to html
        outputMessage("Player " + currentPlayer.getMark() + "'s turn");
      } else {
        currentPlayer = playerX;
        //output to html
        outputMessage("Player " + currentPlayer.getMark() + "'s turn");
      }
    }
  };

  const init_board = (pX, pO) => {
    playerX = pX;
    playerO = pO;
    currentPlayer = playerX;
    //alert(currentPlayer.getMark());
    //output to html
    outputMessage("Player " + currentPlayer.getMark() + "'s turn");

    let grid_items = document.querySelectorAll(".container-item");
    console.log("w" + grid_items.length);
    let i;
    let row = [];
    for (i = 0; i < grid_items.length; i++) {
      grid_items[i].addEventListener("click", grid_item_click);
      gameBoard_state.push("");
    }
    console.log(row);

    console.log(gameBoard_state);
  };

  const set_mark = (event) => {
    let mark = currentPlayer.getMark();

    ///If already marked
    if (event.target.innerHTML != "") {
      outputMessage(
        "Player " + currentPlayer.getMark() + ", Select another box"
      );
      gameBoardTurnError = true;
      return;
    }
    ///

    // event.target.innerHTML = mark;
    event.target.innerHTML = "<p>" + mark + "</p>";

    let grid_items = document.querySelectorAll(".container-item");
    let i;
    for (i = 0; i < grid_items.length; i++) {
      if (grid_items[i] == event.target) {
        gameBoard_state[i] = mark;
      }
    }
    gameBoardTurnError = false;

    ///if draw
    // if (!spaceLeft() && getVictor()=="") {
    //   gameBoardTurnError = true;
    //   alert("Draw");
    //   gameOver = true;
    //   return;
    // }
    ///

    //checkForGameOver();
    //manageTurns();
  };

  const checkForGameOver = () => {
    //poppulating grid
    let mark = currentPlayer.getMark();
    let gameBoard_grid = [];
    let i;
    let row = [];
    for (i = 0; i < gameBoard_state.length; i++) {
      //sets grid
      row.push(gameBoard_state[i]);
      if (row.length == 3) {
        gameBoard_grid.push(row);
        row = [];
      }
    }

    console.log(gameBoard_grid);

    //horiontal scan
    for (i = 0; i < gameBoard_grid.length; i++) {
      if (gameBoard_grid[i].map((ele) => ele == mark).includes(false) != true) {
        victor = mark;
        console.log("h win by Player: " + victor);
        outputMessage(victor+" Won!!");
        return;
      }
    }

    //vertical scan
    for (i = 0; i < gameBoard_grid.length; i++) {
      let x;
      let column = [];
      for (x = 0; x < gameBoard_grid[i].length; x++) {
        column.push(gameBoard_grid[x][i]);
      }
      if (column.map((ele) => ele == mark).includes(false) != true) {
        victor = mark;
        console.log("v win by Player: " + victor);
        outputMessage(victor+" Won!!");
      }
    }

    //left to right diagonal \ scan
    let diagonal = [];
    for (i = 0; i < gameBoard_grid.length; i++) {
      diagonal.push(gameBoard_grid[i][i]);
      if (
        diagonal.length == 3 &&
        diagonal.map((ele) => ele == mark).includes(false) != true
      ) {
        victor = mark;
        console.log("left to rigth diagonal win by Player:" + victor);
        outputMessage(victor+" Won!!");
        diagonal = [];

        break;
      }
    }

    //rigth to left diagonal / scan
    diagonal = [];
    for (i = 0; i < gameBoard_grid.length; i++) {
      diagonal.push(gameBoard_grid[i][gameBoard_grid.length - 1 - i]);
      if (
        diagonal.length == 3 &&
        diagonal.map((ele) => ele == mark).includes(false) != true
      ) {
        victor = mark;
        console.log("rigth to left diagonal win by player:" + victor);
        outputMessage(victor+" Won!!");
        diagonal = [];
        break;
      }
    }
  };

  return {
    init_board,
    checkForGameOver,
    set_mark,
    getVictor,
    isGameOver,
    manageTurns,
    spaceLeft,
    checkForGameDraw,
  };
})();

const Player = (mark) => {
  const PlayerMark = mark;
  const getMark = () => mark;

  return { getMark };
};

function outputMessage(message = "default message") {
  //output to html
  let output;
  output = document.getElementsByClassName("output-div")[0];
  output.innerHTML = "<h1>" + message + "</h2>";
}

const playerX = Player("X");
const playerO = Player("O");
window.onload = function () {
  document.getElementsByClassName("reset-button")[0].addEventListener("click", resetBottonClick);
  gameBoard.init_board(playerX, playerO);
};
