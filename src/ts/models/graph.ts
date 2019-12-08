import { convertAxialToArrayIndicies } from "../helpers/grid-helper";
import { GridType, IGrid } from "./grid";

interface Node {
  x: number;
  y: number;
  isWall: boolean;
}

class Graph {

  nodes: Node[][];
  width: number;
  height: number;
  gridType: GridType;

  constructor(grid: IGrid) {
    this.nodes = grid.mapTilesToGraphNodes();
    this.width = grid.horizontalCount;
    this.height = grid.verticalCount;
    this.gridType = grid.type;
  }

  private squareGridNeighbors(node: Node): Node[] {
    let result: Node[] = [];

    if (this.isInBounds(node.x + 1, node.y)) {
      result.push(this.nodes[node.x + 1][node.y]);
    }
    if (this.isInBounds(node.x - 1, node.y)) {
      result.push(this.nodes[node.x - 1][node.y]);
    }
    if (this.isInBounds(node.x, node.y + 1)) {
      result.push(this.nodes[node.x][node.y + 1]);
    }
    if (this.isInBounds(node.x, node.y - 1)) {
      result.push(this.nodes[node.x][node.y - 1]);
    }

    result = result.filter(n => !n.isWall);
    return result;
  }

  private hexagonGridNeighbors(node: Node): Node[] {
    const axialDirections = [[+1, 0], [+1, -1], [0, -1], [-1, 0], [-1, +1], [0, +1]];
    let result: Node[] = [];

    axialDirections.forEach(direction => {
      const q = node.x + direction[0];
      const r = node.y + direction[1];
      
      let { i, j } = convertAxialToArrayIndicies(q, r);

      if (this.isInBounds(i, j)) {
        result.push(this.nodes[i][j]);
      }
    });

    result = result.filter(n => !n.isWall);
    return result;
  }

  neighbors(node: Node): Node[] {
    switch (this.gridType) {
      case GridType.Square:
        return this.squareGridNeighbors(node);
      case GridType.Hexagon:
        return this.hexagonGridNeighbors(node);
    }
  }

  isInBounds(x: number, y: number): boolean {
    switch (this.gridType) {
      case GridType.Square:
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
      case GridType.Hexagon:
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    
  }

  areEqual(nodeA: Node, nodeB: Node): boolean {
    return nodeA.x === nodeB.x && nodeA.y === nodeB.y;
  }
}

class WeightedGraph extends Graph {

  cost(fromNode: Node, toNode: Node): number {
    return 1;
  }
}

export { Graph, WeightedGraph, Node };
