import { convertAxialToArrayIndicies } from "./helpers/grid-helper";

import { IGrid, SquareGrid, HexagonGrid, Tile, TileState, Queue, PathfindingResult, Node } from "./models";

class Visualizer {

  static get isSimulationRunning(): boolean {
    return Visualizer._isSimulationRunning;
  };

  private static _isSimulationRunning: boolean = false;
  private static _intervalId: number;

  private static setTileStateByNodeCoordinates(grid: IGrid, node: Node, state: TileState, passThroughWeightedTiles: boolean) {
    let tile: Tile | null = null;

    if (grid instanceof SquareGrid) {
      tile = grid.tiles[node.x][node.y];
    } else if (grid instanceof HexagonGrid) {
      let { i, j } = convertAxialToArrayIndicies(node.x, node.y);
      tile = grid.tiles[i][j];
    }

    if (!tile || [TileState.Start, TileState.Goal].includes(tile.state) ||
        (tile.state === TileState.Weighted && !passThroughWeightedTiles)) {
      return;
    }

    grid.setTileState(tile, state);
  }

  private static simulateTiles(
    nodeQueue: Queue<Node>,
    grid: IGrid,
    newTileState: TileState,
    simulationStepDelay: number,
    completeCallback?: () => void,
    passThroughWeightedTiles: boolean = false) {

    Visualizer._intervalId = setInterval(() => {
      const nextNode = nodeQueue.dequeue();

      if (!nextNode) {
        clearInterval(Visualizer._intervalId);
        completeCallback && completeCallback();
        return;
      }

      this.setTileStateByNodeCoordinates(grid, nextNode, newTileState, passThroughWeightedTiles);
    }, simulationStepDelay);
  }

  static simulate(grid: IGrid, pathfindingResult: PathfindingResult, simulationStepDelay: number = 100) {
    if (Visualizer._isSimulationRunning) { return; }

    Visualizer._isSimulationRunning = true;

    const visitedQueue = new Queue<Node>(pathfindingResult.visited);
    const pathQueue = new Queue<Node>(pathfindingResult.path);

    Visualizer.simulateTiles(visitedQueue, grid, TileState.Visited, simulationStepDelay, () => {
      Visualizer.simulateTiles(pathQueue, grid, TileState.Path, 40, () => {
        Visualizer._isSimulationRunning = false;
      }, true);
    });
  }

  static showShortestPath(grid: IGrid, pathfindingResult: PathfindingResult, passThroughWeightedTiles: boolean = false) {
    this.reset(grid);

    pathfindingResult.visited.forEach((visitedNode: Node) => {
      this.setTileStateByNodeCoordinates(grid, visitedNode, TileState.Visited, passThroughWeightedTiles);
    });

    pathfindingResult.path.forEach((pathNode: Node) => {
      this.setTileStateByNodeCoordinates(grid, pathNode, TileState.Path, passThroughWeightedTiles);
    });
  }

  static reset(grid: IGrid) {
    clearInterval(Visualizer._intervalId);
    Visualizer._isSimulationRunning = false;

    for (let i = 0; i < grid.horizontalCount; i++) {
      for (let j = 0; j < grid.verticalCount; j++) {
        const tile = grid.tiles[i][j];

        if ([TileState.Start, TileState.Goal, TileState.Wall, TileState.Weighted].includes(tile.state)) {
          continue;
        }
  
        grid.setTileState(tile, TileState.Unvisited);
      }
    }
  }
}

export default Visualizer;
