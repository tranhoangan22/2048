import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard); // set `tile` property of the random cell object on the grid to a Tile object
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

// listener for user input
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    default: // we didn't click a key that does any of the above, so we can wait for another user input by calling setupInput() again, and exit handleInput function
      setupInput();
      return;
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

// group is column if cells is cellsByColumn
function slideTiles(cells) {
  cells.forEach((group) => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      if (!cell.tile) continue; // if there is no tile on this cell, do nothing, and continue with next cell
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];
        if (!moveToCell.canAccept(cell.tile)) break; // if it can't move up 1 cell, it can't even move up further
        lastValidCell = moveToCell; // `lastValidCell` -> the last cell that we're able to move to
      }
      if (lastValidCell) {
        if (lastValidCell.tile) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
}

/**
 * Note:
 * When `grid.randomEmptyCell().tile` is a assigned a value, the setter method for `tile` property in the empty Cell object, gets called
 * Then the setter methods for `x` and `y` in the Tile objects get called (because x, and y properties on the Tile objects are assigned values).
 * 	- `x` and `y` on Tile object are assigned the `x` and `y` of the (empty) Cell object.
 * Then the `--x` and `--y` attributes of the newly created HTML div elements (`tileObj.tileElement`) (with `tile` attribute) are set and the Tiles (with number) will appear at the positions of the randomly selected grid on the Grid object
 */
