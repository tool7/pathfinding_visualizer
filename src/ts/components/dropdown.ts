class Dropdown extends HTMLElement {
  elementHead: HTMLElement;
  elementBody: HTMLElement;

  constructor() {
    super();

    const shadowDom = this.attachShadow({ mode: "open" });
    const template = document.getElementById("dropdown-template")! as HTMLTemplateElement;
    const templateHtml = template.content.cloneNode(true);

    shadowDom.appendChild(templateHtml);

    const menu = shadowDom.getElementById("dropdown-menu")!;
    this.elementHead = menu.children[0] as HTMLElement;
    this.elementBody = menu.children[1] as HTMLElement;
  }

  private open() {
    this.elementBody.style.display = "block";
  }

  private close() {
    this.elementBody.style.display = "none";
  }
 
  connectedCallback() {
    this.close();

    this.elementHead.addEventListener("click", () => {
      if (this.elementBody.style.display === "none") {
        this.open();
      } else {
        this.close();
      }
    });

    this.elementBody.addEventListener("click", e => {
      const target = e.target as any;
      if (target && target !== e.currentTarget) {
        this.elementHead.children[0].textContent = target.textContent;

        this.dispatchEvent(new CustomEvent("select", {
          detail: target.textContent
        }));
      }

      this.close();
    });
  }
}

export default Dropdown;
