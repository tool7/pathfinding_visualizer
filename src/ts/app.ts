import { GridTileCount } from "./config/grid-config";
import { getNumberFactors } from "./helpers/number";

import breadthFirstSearch from "./algorithms/breadth-first-search";
import dijkstraAlgorithm from "./algorithms/dijkstra-algorithm";
import greedyBestFirstSearch from "./algorithms/greedy-best-first-search";
import aStarSearch from "./algorithms/a-star-search";

import Grid from "./models/grid";
import { Graph, WeightedGraph } from "./models/graph";
import { Tile, TileState } from "./models/tile";

import Visualizer from "./visualizer";

/*
  TODO:
  - add button for toggling grid type from square to hexagon
  
*/

let grid: Grid;
let visualizeToggleButton: HTMLButtonElement;
let clearWallsButton: HTMLButtonElement;

initGrid();
initControls();

function initGrid(): void {
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

  const gridElement = document.getElementById("grid")!;
  grid = new Grid(gridElement, tileSize, xAxisTileCount, yAxisTileCount);
}

function initControls(): void {
  visualizeToggleButton = document.getElementById("visualize-toggle-btn") as HTMLButtonElement;
  visualizeToggleButton.addEventListener("click", onVisualizeButtonClick);

  clearWallsButton = document.getElementById("clear-walls-btn") as HTMLButtonElement;
  clearWallsButton.addEventListener("click", onClearWallsButtonClick);
}

function onVisualizeButtonClick() {
  if (visualizeToggleButton!.classList.contains("cancel")) {
    Visualizer.clear(grid);

    visualizeToggleButton!.innerHTML = "Visualize";
    visualizeToggleButton!.className = "start";
    return;
  }

  const start = { x: grid.startTile!.x, y: grid.startTile!.y, isWall: false };
  const goal = { x: grid.goalTile!.x, y: grid.goalTile!.y, isWall: false };
  const nodes = grid.mapTilesToGraphNodes();
  const graph = new WeightedGraph(nodes, grid.horizontalCount, grid.verticalCount);
  const searchResult = aStarSearch(graph, start, goal);

  Visualizer.simulate(grid, searchResult, 10);

  visualizeToggleButton!.innerHTML = "Cancel simulation";
  visualizeToggleButton!.className = "cancel";
}

function onClearWallsButtonClick() {
  grid.clearWallTiles();
}
