import { convertAxialToArrayIndicies } from "./helpers/grid-helper";

import { IGrid, SquareGrid, HexagonGrid, TileState, Queue, PathfindingResult, Node } from "./models";

class Visualizer {

  static get isRunning(): boolean {
    return Visualizer._isRunning;
  };

  private static _isRunning: boolean = false;
  private static _intervalId: number;

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

      let tile: any;

      if (grid instanceof SquareGrid) {
        tile = grid.tiles[nextNode.x][nextNode.y];
      } else if (grid instanceof HexagonGrid) {
        let { i, j } = convertAxialToArrayIndicies(nextNode.x, nextNode.y);
        tile = grid.tiles[i][j];
      }

      if ([TileState.Start, TileState.Goal].includes(tile.state) ||
          (tile.state === TileState.Weighted && !passThroughWeightedTiles)) {
        return;
      }

      grid.setTileState(tile, newTileState);

    }, simulationStepDelay);
  }

  static simulate(grid: IGrid, pathfindingResult: PathfindingResult, simulationStepDelay: number = 100) {
    if (Visualizer._isRunning) { return; }

    Visualizer._isRunning = true;

    const visitedQueue = new Queue<Node>(pathfindingResult.visited);
    const pathQueue = new Queue<Node>(pathfindingResult.path);

    Visualizer.simulateTiles(visitedQueue, grid, TileState.Visited, simulationStepDelay, () => {
      Visualizer.simulateTiles(pathQueue, grid, TileState.Path, 40, () => {
        Visualizer._isRunning = false;
      }, true);
    });
  }

  static reset(grid: IGrid) {
    clearInterval(Visualizer._intervalId);
    Visualizer._isRunning = false;

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
