import Queue from "../../queue";
import HashMap from "../../hash-map";
import { GridGraph, GridNode } from "../../grid-graph";

function breadthFirstSearch(graph: GridGraph, start: GridNode, goal: GridNode) {
  let frontier = new Queue();
  let cameFrom = new HashMap();
  let path = [];

  frontier.enqueue(start);
  cameFrom.set(start, null);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    if (graph.areEqual(current, goal)) { break; }

    graph.neighbours(current).forEach((next: any) => {
      if (cameFrom.contains(next)) { return; }

      frontier.enqueue(next);
      cameFrom.set(next, current);
    });
  }

  // Reconstructing the path
  let current = goal;
  while (!graph.areEqual(current, start)) {
    path.push(current);
    current = cameFrom.get(current);
  }

  return path.reverse();
}
