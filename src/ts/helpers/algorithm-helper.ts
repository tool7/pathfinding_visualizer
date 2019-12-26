import { IGrid, WeightedGraph, Node, PathfindingResult, GridType } from "../models";
import { squareGridHeuristic, hexagonGridHeuristic } from "../config/algorithm-config";
import { breadthFirstSearch, depthFirstSearch, dijkstraAlgorithm, greedyBestFirstSearch, aStarSearch } from "../algorithms";

function findPathBySelectedAlgorithm(algorithmName: string, graph: WeightedGraph, start: Node, goal: Node, heuristicFunction: (a: Node, b: Node) => number): PathfindingResult | void {
  switch (algorithmName) {
    case "bfs":
      return breadthFirstSearch(graph, start, goal);
    case "dfs":
      return depthFirstSearch(graph, start, goal);
    case "gbfs":
      return greedyBestFirstSearch(graph, start, goal, heuristicFunction);
    case "dijkstra":
      return dijkstraAlgorithm(graph, start, goal);
    case "astar":
      return aStarSearch(graph, start, goal, heuristicFunction);
  }
}

export function searchShortestPath(grid: IGrid, algorithmName: string, gridType: GridType): PathfindingResult | void {
  const start: Node = { x: grid.startTile!.x, y: grid.startTile!.y, isWall: false, weight: 0 };
  const goal = { x: grid.goalTile!.x, y: grid.goalTile!.y, isWall: false, weight: 0 };
  const graph = new WeightedGraph(grid, gridType);

  const heuristicFunction = gridType === GridType.Square ? squareGridHeuristic : hexagonGridHeuristic;
  const searchResult = findPathBySelectedAlgorithm(algorithmName, graph, start, goal, heuristicFunction);

  return searchResult;
}
