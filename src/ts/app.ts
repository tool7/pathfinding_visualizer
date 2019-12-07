import { GridTileCount } from "./config/grid-config";
import { squareGridHeuristic, hexagonGridHeuristic } from "./config/algorithm-config";
import { getNumberFactors } from "./helpers/number";

import breadthFirstSearch from "./algorithms/breadth-first-search";
import dijkstraAlgorithm from "./algorithms/dijkstra-algorithm";
import greedyBestFirstSearch from "./algorithms/greedy-best-first-search";
import aStarSearch from "./algorithms/a-star-search";

import SquareGrid from "./models/square-grid";
import HexagonGrid from "./models/hexagon-grid";
import { Graph, WeightedGraph } from "./models/graph";
import { GridType, IGrid, Tile, TileState } from "./models/grid";

import Visualizer from "./visualizer";

/*
  TODO:
  - add button for toggling grid type from square to hexagon
  
*/

let activeGridType: GridType = GridType.Square;
let squareGridContainer: HTMLElement;
let hexagonGridContainer: HTMLElement;
let squareGrid: IGrid;
let hexagonGrid: IGrid;
let visualizeToggleButton: HTMLButtonElement;
let clearWallsButton: HTMLButtonElement;
let gridTypeToggleButton: HTMLButtonElement;

initGrids();
initControls();

function initGrids(): void {
  const windowScreenRatio = window.innerWidth / window.innerHeight;
  const gridTileCountFactors = getNumberFactors(GridTileCount);
  const tileCountSqrt = Math.sqrt(GridTileCount) * windowScreenRatio;
  let closestTileCountFactor = 0;

  for (let i = 0; i < gridTileCountFactors.length - 1; i++) {
    const currentFactor = gridTileCountFactors[i];
    const nextFactor = gridTileCountFactors[i + 1];

    if (tileCountSqrt >= currentFactor && tileCountSqrt <= nextFactor) {
      const currentFactorDistance = Math.abs(tileCountSqrt - currentFactor);
      const nextFactorDistance = Math.abs(tileCountSqrt - nextFactor);

      const factorDistances = {
        [currentFactorDistance]: currentFactor,
        [nextFactorDistance]: nextFactor
      };

      const minDistance = Math.min(currentFactorDistance, nextFactorDistance);
      closestTileCountFactor = factorDistances[minDistance];
      break;
    }
  }
  
  const xAxisTileCount = closestTileCountFactor;
  const yAxisTileCount = GridTileCount / closestTileCountFactor;
  const tileSize = Math.floor(window.innerWidth / xAxisTileCount);

  const squareGridElement = document.getElementById("square-grid")!;
  squareGrid = new SquareGrid(squareGridElement, tileSize, xAxisTileCount, yAxisTileCount);


  // TODO: Set reasonable xAxisTileCount and yAxisTileCount
  const hexagonGridElement = document.getElementById("hexagon-grid")!;
  hexagonGrid = new HexagonGrid(hexagonGridElement, tileSize, 30, 30);
}

function initControls(): void {
  squareGridContainer = document.getElementById("square-grid-container") as HTMLElement;
  hexagonGridContainer = document.getElementById("hexagon-grid-container") as HTMLElement;

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
      squareGridContainer.classList.remove("visible");
      hexagonGridContainer.classList.add("visible");
      newBtnText = "Switch to square grid";

      activeGridType = GridType.Hexagon;
      break;
  
    case GridType.Hexagon:
      hexagonGridContainer.classList.remove("visible");
      squareGridContainer.classList.add("visible");
      newBtnText = "Switch to hexagon grid";

      activeGridType = GridType.Square;
      break;
  }

  gridTypeToggleButton.innerHTML = newBtnText;
}

// Debugging purpose
onGridTypeToggleButtonClick();
