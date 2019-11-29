interface Node {
  x: number;
  y: number;
}

class Graph {

  nodes: Node[][];
  width: number;
  height: number;

  constructor(nodes: Node[][], width: number, height: number) {
    this.nodes = nodes;
    this.width = width;
    this.height = height;
  }

  neighbors(node: Node): Node[] {
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

    return result;
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  areEqual(nodeA: Node, nodeB: Node): boolean {
    return nodeA.x === nodeB.x && nodeA.y === nodeB.y;
  }

  cost(fromNode: Node, toNode: Node): number {
    return 1;
  }
}

export { Graph, Node };
