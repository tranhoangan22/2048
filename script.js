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

// Use asynchronocity to wait for the move actions to finish before merging the tiles with `cell.mergeTiles()`
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default: // we didn't click a key that does any of the above, so we can wait for another user input by calling setupInput() again, and exit handleInput function
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard); // note: newTile won't be created if we can't move up/down/right/left!
  grid.randomEmptyCell().tile = newTile;

  // if the user can't move anymore, they've lost
  if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
    newTile.waitForTransition(true).then(() => {
      alert("You've lost!");
    });
    return;
  }
  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse())); // Array.prototyp.reverse() changes the original array so we spread the original into a new one
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse())); // Array.prototyp.reverse() changes the original array so we spread the original into a new one
}

// group is column if cells is cellsByColumn
function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
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
          promises.push(cell.tile.waitForTransition()); // wait for the animation to finish
          if (lastValidCell.tile) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((column) => [...column].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false; // eg, we cannot move top-cell upwwards
      if (!cell.tile) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
/**
 * Note:
 * When `grid.randomEmptyCell().tile` is a assigned a value, the setter method for `tile` property in the empty Cell object, gets called
 * Then the setter methods for `x` and `y` in the Tile objects get called (because x, and y properties on the Tile objects are assigned values).
 * 	- `x` and `y` on Tile object are assigned the `x` and `y` of the (empty) Cell object.
 * Then the `--x` and `--y` attributes of the newly created HTML div elements (`tileObj.tileElement`) (with `tile` attribute) are set and the Tiles (with number) will appear at the positions of the randomly selected grid on the Grid object
 */
