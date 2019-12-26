import "./components/dropdown";

import { SQUARE_TILE_SIZE, HEXAGON_TILE_WIDTH } from "./config/grid-config";
import { searchShortestPath } from "./helpers/algorithm-helper";
import { SquareGrid, HexagonGrid, GridType } from "./models";
import Visualizer from "./visualizer";

const gridContainer: HTMLElement = document.getElementById("grid-container")!;
const squareGridElement: HTMLElement = document.getElementById("square-grid")!;
const hexagonGridElement = document.getElementById("hexagon-grid")!;
const algorithmSelector = document.getElementById("algorithm-selector")!;
const simulationDelaySelector = document.getElementById("simulation-delay-selector")!;

const appState = {
  activeGridType: GridType.Square,
  selectedAlgorithm: "dijkstra",
  selectedSimulationDelay: 30,
  isVisualizerActivated: false
};

let squareGrid: SquareGrid;
let hexagonGrid: HexagonGrid;
let visualizeToggleButton: HTMLButtonElement;
let clearWallsButton: HTMLButtonElement;
let clearWeightedTilesButton: HTMLButtonElement;
let gridTypeToggleButton: HTMLButtonElement;

initSquareGrid();
initHexagonGrid();
initControls();

function initSquareGrid(): void {
  const xAxisTileCount = Math.floor(gridContainer.clientWidth / SQUARE_TILE_SIZE);
  const yAxisTileCount = Math.floor(gridContainer.clientHeight / SQUARE_TILE_SIZE);
  squareGrid = new SquareGrid(squareGridElement, xAxisTileCount, yAxisTileCount);

  squareGrid.addEventListener("change", () => {
    if (Visualizer.isSimulationRunning || !appState.isVisualizerActivated) { return; }

    const searchResult = searchShortestPath(squareGrid, appState.selectedAlgorithm, GridType.Square);
    searchResult && Visualizer.showShortestPath(squareGrid, searchResult);
  });
}

function initHexagonGrid(): void {
  const xAxisTileCount = Math.floor(gridContainer.clientWidth / HEXAGON_TILE_WIDTH);
  const yAxisTileCount = Math.floor(gridContainer.clientHeight / HEXAGON_TILE_WIDTH);
  hexagonGrid = new HexagonGrid(hexagonGridElement, xAxisTileCount, yAxisTileCount);

  hexagonGrid.addEventListener("change", () => {
    if (Visualizer.isSimulationRunning || !appState.isVisualizerActivated) { return; }

    const searchResult = searchShortestPath(hexagonGrid, appState.selectedAlgorithm, GridType.Hexagon);
    searchResult && Visualizer.showShortestPath(hexagonGrid, searchResult);
  });
}

function initControls(): void {
  visualizeToggleButton = document.getElementById("visualize-toggle-btn") as HTMLButtonElement;
  visualizeToggleButton.addEventListener("click", onVisualizeButtonClick);

  clearWallsButton = document.getElementById("clear-walls-btn") as HTMLButtonElement;
  clearWallsButton.addEventListener("click", onClearWallsButtonClick);

  clearWeightedTilesButton = document.getElementById("clear-weighted-tiles-btn") as HTMLButtonElement;
  clearWeightedTilesButton.addEventListener("click", onClearWeightedTilesButtonClick);

  gridTypeToggleButton = document.getElementById("grid-type-toggle-btn") as HTMLButtonElement;
  gridTypeToggleButton.addEventListener("click", onGridTypeToggleButtonClick);

  algorithmSelector.addEventListener("select", onAlgorithmSelected);
  simulationDelaySelector.addEventListener("select", onSimulationDelaySelected)
}

function onVisualizeButtonClick() {
  if (visualizeToggleButton!.classList.contains("cancel")) {
    Visualizer.reset(squareGrid);
    Visualizer.reset(hexagonGrid);

    visualizeToggleButton!.innerHTML = "Visualize";
    visualizeToggleButton!.className = "start";

    appState.isVisualizerActivated = false;
    return;
  }

  appState.isVisualizerActivated = true;

  let searchResult;

  switch (appState.activeGridType) {
    case GridType.Square:
      searchResult = searchShortestPath(squareGrid, appState.selectedAlgorithm, GridType.Square);
      searchResult && Visualizer.simulate(squareGrid, searchResult, appState.selectedSimulationDelay);
      break;

    case GridType.Hexagon:
      searchResult = searchShortestPath(hexagonGrid, appState.selectedAlgorithm, GridType.Hexagon);
      searchResult && Visualizer.simulate(hexagonGrid, searchResult, appState.selectedSimulationDelay);
      break;
  }

  visualizeToggleButton!.innerHTML = "Cancel visualization";
  visualizeToggleButton!.className = "cancel";
}

function onClearWallsButtonClick() {
  squareGrid.clearWallTiles();
  hexagonGrid.clearWallTiles();
}

function onClearWeightedTilesButtonClick() {
  squareGrid.clearWeightedTiles();
  hexagonGrid.clearWeightedTiles();
}

function onGridTypeToggleButtonClick() {
  let newBtnText = "";

  switch (appState.activeGridType) {
    case GridType.Square:
      squareGridElement.classList.remove("active");
      hexagonGridElement.classList.add("active");
      newBtnText = "Switch to <b>square</b> grid";

      appState.activeGridType = GridType.Hexagon;
      break;
  
    case GridType.Hexagon:
      hexagonGridElement.classList.remove("active");
      squareGridElement.classList.add("active");
      newBtnText = "Switch to <b>hexagon</b> grid";

      appState.activeGridType = GridType.Square;
      break;
  }

  gridTypeToggleButton.innerHTML = newBtnText;
}

function onAlgorithmSelected(e: any) {
  appState.selectedAlgorithm = e.detail;
}

function onSimulationDelaySelected(e: any) {
  appState.selectedSimulationDelay = +e.detail;
}
