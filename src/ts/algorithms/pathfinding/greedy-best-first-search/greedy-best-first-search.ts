import PriorityQueue from "../priority-queue";
import HashMap from "../hash-map";
import PathfindingResult from "../pathfinding-result";
import { WeightedGraph, Node } from "../graph";

// Heuristic function that tells us how close we are to the goal
function heuristic(nodeA: Node, nodeB: Node): number {
  return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

function greedyBestFirstSearch(graph: WeightedGraph, start: Node, goal: Node): PathfindingResult {
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

      const priority = heuristic(next, goal);
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
