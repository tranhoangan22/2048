const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

/**
 * objects of class Grid will have
 * - a property `cells` which is an array of Cell objects
 * - upon construction, a series of div elements with class `cell` will be added as child elements to the gridElement that is passed in the constructor
 */
export default class Grid {
  #cells; // private property that can only be accessed inside Grid
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    // for each cell (html) element, return a Cell object
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE, // x
        Math.floor(index / GRID_SIZE) // y
      );
    });
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []; // if cellGrid[cell.x] doesn't exist yet, initialize it as an empty array
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  // bind the private property `emptyCells` to a function, which will be called when that property is looked up
  get #emptyCells() {
    return this.#cells.filter((cell) => !cell.tile);
  }

  // return a random empty Cell object (where tile is null)
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

/**
 * a cell Object will have
 * - a `cellElement` property, which is a div element with class name of `cell`
 * - x coordinate
 * - y coordinate
 * - tile
 */
class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  /**
   * set the Tile object of a Cell object. First the Cell object's Tile object is assigned the passed-in tileObj.
   * Then the Cell object's new Tile object will be assigned the x, y coordinates of the Cell object, so it can appear (with css) that the Tile object is on the cell.
   **/
  set tile(tileObj) {
    this.#tile = tileObj;
    if (!tileObj) return;
    this.#tile.x = this.#x; // this.#tile === tileObj, pointing to the same space in memory
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (!value) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  /**
   * Can the current Cell object accept a Tile object? Yes if:
   * - the tile of the current cell is null
   * - if the value of the Tile object on current Cell object is equal to the value of the Tile object being passed in
   * - if don't have a mergeTile specified. If you already have a mergeTile, we can't do another merge => we can only merge one Tile at a time
   **/
  canAccept(tile) {
    return !this.tile || (!this.mergeTile && this.tile.value === tile.value);
  }
}

/**
 * @param {HTML Element} gridElement
 * @returns an array of HTML elements (which are `div`s with class name of `cell`) which will also be appended as child elements to the gridElement
 */
function createCellElements(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
