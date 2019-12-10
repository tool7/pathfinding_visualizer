class Dropdown extends HTMLElement {
  shadowDom: ShadowRoot;
  headElement: HTMLElement;
  bodyElement: HTMLElement;
  selectedTextElement: HTMLElement;
  collapseIconElement: HTMLElement;

  constructor() {
    super();

    this.shadowDom = this.attachShadow({ mode: "open" });
    this.shadowDom.innerHTML = `
      <style>
        #dropdown-menu {
          font-family: Consolas;
          width: 24rem;
          display: block;
          background-color: transparent;
          user-select: none;
        }

        .dropdown-menu__head:hover {
          cursor: pointer;
        }
    
        .dropdown-menu__head {
          display: flex;
          align-items: center;
          background-color: lightskyblue;
        }

        .dropdown-menu__body {
          background-color: lightskyblue;
        }
    
        .dropdown-menu__head,
        ::slotted(.menu-option) {
          min-height: 3rem;
        }

        .collapse-icon {
          height: 2rem;
          width: 2rem;
          position: absolute;
          right: 1rem;
        }

        .collapse-icon.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu__body {
          max-height: 20rem;
          overflow-y: scroll;
          overflow-x: hidden;
          border-top: 1px solid black;
        }
    
        .selected-text {
          color: black;
          height: 3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 1rem 0 0 1.5rem;
        }
    
        .selected-text,
        ::slotted(.menu-option) {
          font-size: 1.4rem;
        }
    
        ::slotted(.menu-option) {
          color: black;
          position: relative;
          padding: .5rem 0 .5rem 1.5rem !important;
          display: flex;
          align-items: center;
          transition: background-color .1s linear, color .1s linear;
        }
    
        ::slotted(.menu-option:hover) {
          cursor: pointer;
          background-color: mediumaquamarine;
        }
    
        .dropdown-menu__body::-webkit-scrollbar {
          width: 0rem;
        }
    
        .dropdown-menu__body::-webkit-scrollbar-thumb {
          background-color: black;
          border-left: 2.4rem solid rgba(0, 0, 0, 0);
          background-clip: padding-box;
        }
    
        .dropdown-menu__body::-webkit-scrollbar-track {
          background-color: lightskyblue;
        }
      </style>
    
      <div id="dropdown-menu">
        <div class="dropdown-menu__head">
          <div class="selected-text"></div>
          <img class="collapse-icon" src="./assets/icon-arrow-down.svg"">
        </div>
        <div class="dropdown-menu__body">
          <slot></slot>
        </div>
      </div>
    `;

    const menu = this.shadowDom.getElementById("dropdown-menu")!;
    this.headElement = menu.getElementsByClassName("dropdown-menu__head")[0] as HTMLElement;
    this.bodyElement = menu.getElementsByClassName("dropdown-menu__body")[0] as HTMLElement;
    this.selectedTextElement = menu.getElementsByClassName("selected-text")[0] as HTMLElement;
    this.collapseIconElement = menu.getElementsByClassName("collapse-icon")[0] as HTMLElement;
  }
 
  connectedCallback() {
    this.close();
    this.setInitialValue();
    this.setupEventHandlers();
  }

  private setInitialValue(): void {
    const initialValue = this.getAttribute("initial-value");
    if (!initialValue) { return; }

    const onSlotChange = (e: Event) => {
      const slot: any = e.target;

      let valueTextMap: any = {};
      slot.assignedElements().forEach((el: any) => {
        valueTextMap[el.dataset.value] = el.textContent;
      });
      
      this.selectedTextElement.textContent = valueTextMap[initialValue] || "Choose item";
      this.shadowDom.removeEventListener("slotchange", onSlotChange);
    };

    this.shadowDom.addEventListener("slotchange", onSlotChange);
  }

  private setupEventHandlers(): void {
    this.headElement.addEventListener("click", () => {
      if (this.bodyElement.style.display === "none") {
        this.open();
      } else {
        this.close();
      }
    });

    this.bodyElement.addEventListener("click", e => {
      const target: any = e.target;
      if (target && target !== e.currentTarget) {
        this.selectedTextElement.textContent = target.textContent;

        this.dispatchEvent(new CustomEvent("select", {
          detail: target.dataset.value
        }));
      }

      this.close();
    });
  }

  private open(): void {
    this.bodyElement.style.display = "block";
    this.collapseIconElement.classList.add("rotated");
  }

  private close(): void {
    this.bodyElement.style.display = "none";
    this.collapseIconElement.classList.remove("rotated");
  }
}

customElements.define("drop-down", Dropdown);

export default Dropdown;
