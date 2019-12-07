import PriorityQueue from "../models/priority-queue";
import HashMap from "../models/hash-map";
import PathfindingResult from "../models/pathfinding-result";
import { WeightedGraph, Node } from "../models/graph";

function greedyBestFirstSearch(graph: WeightedGraph, start: Node, goal: Node, heuristicFunction: (nodeA: Node, nodeB: Node) => number): PathfindingResult {
  let frontier = new PriorityQueue<Node>();
  let cameFrom = new HashMap();
  let visited: Node[] = [];
  let path: Node[] = [];

  frontier.enqueue(start, 0);
  cameFrom.set(start, null);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    // Adding to visited array only because of visualization
    visited.push(current);

    if (graph.areEqual(current, goal)) { break; }

    graph.neighbors(current).forEach((next: any) => {
      // Checking if it is already visited node
      if (cameFrom.contains(next)) { return; }

      cameFrom.set(next, current);

      const priority = heuristicFunction(next, goal);
      frontier.enqueue(next, priority);
    });
  }

  // Reconstructing the path
  let current = goal;
  while (!graph.areEqual(current, start)) {
    path.push(current);
    current = cameFrom.get(current);
  }
  path.reverse();

  return { path, visited };
}

export default greedyBestFirstSearch;
