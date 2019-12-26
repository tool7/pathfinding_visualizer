export default class Stack<T> {

  elements: T[];

  constructor(initialElements: T[] = []) {
    this.elements = initialElements;
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  push(item: T): void {
    this.elements.push(item);
  }

  pop(): T {
    if (this.elements.length === 0) {
      return null as any;
    }

    return this.elements.pop() as T;
  }
}
