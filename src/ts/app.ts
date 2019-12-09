import { SQUARE_TILE_SIZE, HEXAGON_TILE_WIDTH } from "./config/grid-config";
import { squareGridHeuristic, hexagonGridHeuristic } from "./config/algorithm-config";

import { breadthFirstSearch, dijkstraAlgorithm, greedyBestFirstSearch, aStarSearch } from "./algorithms";
import { WeightedGraph, IGrid, SquareGrid, HexagonGrid, GridType } from "./models";

import Visualizer from "./visualizer";

const gridContainer: HTMLElement = document.getElementById("grid-container")!;
const squareGridElement: HTMLElement = document.getElementById("square-grid")!;
const hexagonGridElement = document.getElementById("hexagon-grid")!;

let activeGridType: GridType = GridType.Square;
let squareGrid: IGrid;
let hexagonGrid: IGrid;
let visualizeToggleButton: HTMLButtonElement;
let clearWallsButton: HTMLButtonElement;
let gridTypeToggleButton: HTMLButtonElement;

initSquareGrid();
initHexagonGrid();
initControls();

function initSquareGrid(): void {
  const xAxisTileCount = Math.floor(gridContainer.clientWidth / SQUARE_TILE_SIZE);
  const yAxisTileCount = Math.floor(gridContainer.clientHeight / SQUARE_TILE_SIZE);
  squareGrid = new SquareGrid(squareGridElement, xAxisTileCount, yAxisTileCount);
}

function initHexagonGrid(): void {
  const xAxisTileCount = Math.floor(gridContainer.clientWidth / HEXAGON_TILE_WIDTH);
  const yAxisTileCount = Math.floor(gridContainer.clientHeight / HEXAGON_TILE_WIDTH);
  hexagonGrid = new HexagonGrid(hexagonGridElement, xAxisTileCount, yAxisTileCount);
}

function initControls(): void {
  visualizeToggleButton = document.getElementById("visualize-toggle-btn") as HTMLButtonElement;
  visualizeToggleButton.addEventListener("click", onVisualizeButtonClick);

  clearWallsButton = document.getElementById("clear-walls-btn") as HTMLButtonElement;
  clearWallsButton.addEventListener("click", onClearWallsButtonClick);

  gridTypeToggleButton = document.getElementById("grid-type-toggle-btn") as HTMLButtonElement;
  gridTypeToggleButton.addEventListener("click", onGridTypeToggleButtonClick);
}

function onVisualizeButtonClick() {
  if (visualizeToggleButton!.classList.contains("cancel")) {
    Visualizer.clear(squareGrid);
    Visualizer.clear(hexagonGrid);

    visualizeToggleButton!.innerHTML = "Visualize";
    visualizeToggleButton!.className = "start";
    return;
  }

  let start, goal, graph, searchResult;

  switch (activeGridType) {
    case GridType.Square:
      start = { x: squareGrid.startTile!.x, y: squareGrid.startTile!.y, isWall: false };
      goal = { x: squareGrid.goalTile!.x, y: squareGrid.goalTile!.y, isWall: false };

      graph = new WeightedGraph(squareGrid);
      searchResult = aStarSearch(graph, start, goal, squareGridHeuristic);
    
      Visualizer.simulate(squareGrid, searchResult, 10);
      break;

    case GridType.Hexagon:
      start = { x: hexagonGrid.startTile!.x, y: hexagonGrid.startTile!.y, isWall: false };
      goal = { x: hexagonGrid.goalTile!.x, y: hexagonGrid.goalTile!.y, isWall: false };
      
      graph = new WeightedGraph(hexagonGrid);
      searchResult = aStarSearch(graph, start, goal, hexagonGridHeuristic);
    
      Visualizer.simulate(hexagonGrid, searchResult, 10);
      break;
  }

  visualizeToggleButton!.innerHTML = "Cancel simulation";
  visualizeToggleButton!.className = "cancel";
}

function onClearWallsButtonClick() {
  squareGrid.clearWallTiles();
  hexagonGrid.clearWallTiles();
}

function onGridTypeToggleButtonClick() {
  let newBtnText = "";

  switch (activeGridType) {
    case GridType.Square:
      squareGridElement.classList.remove("active");
      hexagonGridElement.classList.add("active");
      newBtnText = "Switch to square grid";

      activeGridType = GridType.Hexagon;
      break;
  
    case GridType.Hexagon:
      hexagonGridElement.classList.remove("active");
      squareGridElement.classList.add("active");
      newBtnText = "Switch to hexagon grid";

      activeGridType = GridType.Square;
      break;
  }

  gridTypeToggleButton.innerHTML = newBtnText;
}
