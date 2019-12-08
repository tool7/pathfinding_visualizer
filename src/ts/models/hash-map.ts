export default class HashMap {

  items: any;

  constructor() {
    this.items = {};
  }

  private getIndex(key: any): string {
    return JSON.stringify(key);
  }

  set(key: any, value: any): void {
    if (!key) { throw "HashMap: set(key) - invalid key"; }

    const index = this.getIndex(key);
    this.items[index] = value;
  }

  get(key: any): any {
    if (!key) { throw "HashMap: get(key) - invalid key"; }

    const index = this.getIndex(key);
    return this.items[index];
  }

  contains(key: any): boolean {
    if (!key) { throw "HashMap: contains(key) - invalid key"; }

    const index = this.getIndex(key);
    const item = this.items[index];

    return !!item;
  }
}
