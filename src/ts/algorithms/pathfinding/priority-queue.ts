interface Element {
  item: any;
  priority: number;
}

class PriorityQueue {

  elements: Element[];

  constructor() {
    this.elements = [];
  }

  isEmpty() {
    return this.elements.length === 0;
  }
  
  enqueue(item: any, priority: number): void {
    this.elements.push({ item, priority });
  }

  dequeue(): any {
    if (this.elements.length === 0) {
      return null;
    }

    let bestIndex = 0;

    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].priority < this.elements[bestIndex].priority) {
        bestIndex = i;
      }
    }

    let bestItem = this.elements[bestIndex].item;
    if (bestIndex > -1) {
      this.elements.splice(bestIndex, 1);
    }

    return bestItem;
  }
}

export default PriorityQueue;
