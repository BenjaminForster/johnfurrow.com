export default class TextCycler {
  constructor(options) {
    this.options = options;

    this.currentItemIndex = 0;
    this.currentNodeIndex = 0;
    this.cycleLength = options.cycleLength || 3000;
    this.mountPoint = this.getMountPoint();
    this.nodes = [];

    if (this.mountPoint != null) {
      this.init();
    }
  }

  getHiddenNodeIndex() {
    return this.currentNodeIndex === 0 ? 1 : 0;
  }

  getMountPoint() {
    let elements = global.document.querySelectorAll(this.options.selector);

    if (!!elements && elements.length > 0) {
      return elements[0];
    }

    return null;
  }

  getNextItemIndex() {
    let nextTextIndex = this.currentItemIndex + 1;

    if (this.currentItemIndex === this.options.items.length - 1) {
      nextTextIndex = 0;
    }

    return nextTextIndex;
  }

  getNextItemText() {
    return `${this.options.items[this.getNextItemIndex()]}<span class="text-cycle__copy__period">.</span>`;
  }

  handleNodeTransitionEnd(event) {
    if (event.propertyName === 'opacity') {
      this.prepareNextNode();
    }
  }

  increment() {
    let hiddenNodeIndex = this.getHiddenNodeIndex();

    this.nodes[this.currentNodeIndex].classList.remove('text-cycle__copy--active');
    this.nodes[hiddenNodeIndex].classList.add('text-cycle__copy--active');
    this.nodes.placeholder.innerHTML = this.getNextItemText();

    this.currentItemIndex = this.getNextItemIndex();
    this.currentNodeIndex = hiddenNodeIndex;
  }

  init() {
    let firstItemNode = this.mountPoint.firstChild;
    let nextItemNode = global.document.createElement('span');
    let placeholderItemNode = global.document.createElement('span');

    firstItemNode.addEventListener('transitionend',
      this.handleNodeTransitionEnd.bind(this));

    nextItemNode.classList.add('text-cycle__copy');
    placeholderItemNode.classList.add('text-cycle__copy');
    placeholderItemNode.classList.add('text-cycle__copy--placeholder');

    nextItemNode.innerHTML = this.getNextItemText();
    placeholderItemNode.textContent = `${this.options.items[0]}.`;

    this.nodes = {
      0: firstItemNode,
      1: nextItemNode,
      placeholder: placeholderItemNode
    };

    this.interval = global.setInterval(this.increment.bind(this),
      this.cycleLength);

    this.mountPoint.insertBefore(nextItemNode, firstItemNode);
    this.mountPoint.insertBefore(placeholderItemNode, firstItemNode);
  }

  prepareNextNode() {
    this.nodes[this.getHiddenNodeIndex()].innerHTML = this.getNextItemText();
  }
}
