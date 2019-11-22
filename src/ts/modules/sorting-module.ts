class SortingModule {

  static instance: any;

  constructor() {
    if (!!SortingModule.instance) {
      return SortingModule.instance;
    }

    SortingModule.instance = this;
  }

  init() {
    
  }

  get content() {
    return `
      <div id="sorting-module">
        <h1>Sorting module content</h1>
      </div>
    `;
  }
}

export default SortingModule;
