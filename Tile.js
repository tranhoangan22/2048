export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    const power = Math.log2(v); // determine how many times v has been raised as power of 2
    const backgroundLightness = 100 - power * 9; // as power gets bigger, decrease background lightness
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%` // if background lightness is less than 50%, then use a bright color, otherwise use a dark color
    );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value); // will position tile in correct position on screen with css
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value); // will position tile in correct position on screen with css
  }
}
