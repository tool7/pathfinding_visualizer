import Queue from "../queue";
import HashMap from "../hash-map";
import { Graph } from "../graph";

function breadthFirstSearch(graph: Graph, start: any, goal: any): any[] {
  let frontier = new Queue();
  let cameFrom = new HashMap();
  let path = [];

  frontier.enqueue(start);
  cameFrom.set(start, null);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    if (graph.areEqual(current, goal)) { break; }

    graph.neighbors(current).forEach((next: any) => {
      // Checking if it is already visited node
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

export default breadthFirstSearch;
