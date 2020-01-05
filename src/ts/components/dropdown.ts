class Dropdown extends HTMLElement {
  shadowDom: ShadowRoot;
  headElement: HTMLElement;
  bodyElement: HTMLElement;
  selectedTextElement: HTMLElement;
  collapseIconElement: HTMLElement;
  menuOptionElements: HTMLElement[] = [];

  constructor() {
    super();
    
    const width = this.getAttribute("width");
    const backgroundColor = this.getAttribute("bg-color");
    const textColor = this.getAttribute("txt-color");
    const itemHoverBackgroundColor = this.getAttribute("item-hover-bg-color");
    const itemHoverTextColor = this.getAttribute("item-hover-txt-color") || "#ffffff";

    this.shadowDom = this.attachShadow({ mode: "open" });
    this.shadowDom.innerHTML = `
      <style>
        #dropdown-menu {
          position: relative;
          font-family: Consolas;
          width: ${width};
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
          background-color: ${backgroundColor};
        }

        .dropdown-menu__body {
          position: absolute;
          width: 100%;
          background-color: ${backgroundColor};
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
          margin-top: .5rem;
        }
    
        .selected-text {
          color: ${textColor};
          height: 3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 1rem 0 0 1.5rem;
        }
    
        .selected-text,
        ::slotted(.menu-option) {
          font-size: 1.5rem;
        }
    
        ::slotted(.menu-option) {
          color: ${textColor};
          position: relative;
          padding: .5rem 0 .5rem 1.5rem !important;
          display: flex;
          align-items: center;
          transition: padding .1s ease-in-out, background-color .1s linear, color .1s linear;
        }
    
        ::slotted(.menu-option:hover), ::slotted(.menu-option.selected) {
          cursor: pointer;
          padding-left: 1.8rem !important;
          background-color: ${itemHoverBackgroundColor};
          color: ${itemHoverTextColor};
        }
    
        .dropdown-menu__body::-webkit-scrollbar {
          width: 0;
        }
    
        .dropdown-menu__body::-webkit-scrollbar-thumb {
          background-color: black;
          border-left: 2.4rem solid rgba(0, 0, 0, 0);
          background-clip: padding-box;
        }
    
        .dropdown-menu__body::-webkit-scrollbar-track {
          background-color: ${backgroundColor};
        }
      </style>
    
      <div id="dropdown-menu">
        <div class="dropdown-menu__head">
          <div class="selected-text"></div>
          <img class="collapse-icon" src="./assets/icon-arrow-down.svg">
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
    const initialSelectedValue = this.getAttribute("selected-value");
    if (!initialSelectedValue) { return; }

    const onSlotChange = (e: Event) => {
      const slot: any = e.target;

      let valueTextMap: any = {};
      slot.assignedElements().forEach((el: any) => {
        const dataValue = el.dataset.value;
        valueTextMap[el.dataset.value] = el.textContent;

        if (dataValue === initialSelectedValue) {
          el.classList.add("selected");
        }

        this.menuOptionElements?.push(el);
      });
      
      this.selectedTextElement.textContent = valueTextMap[initialSelectedValue] || "Choose item";
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
        const dataValue = target.dataset.value;
        this.selectedTextElement.textContent = target.textContent;

        this.menuOptionElements.forEach((menuOptionEl: HTMLElement) => {
          menuOptionEl.classList.remove("selected");

          if (menuOptionEl.dataset.value === dataValue) {
            menuOptionEl.classList.add("selected");
          }
        });

        this.dispatchEvent(new CustomEvent("select", {
          detail: dataValue
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
