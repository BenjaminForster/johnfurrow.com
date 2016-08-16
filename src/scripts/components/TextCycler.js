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

  getNextItemNode() {
    let fragment = global.document.createDocumentFragment();
    let nextItemTextNode = global.document
      .createTextNode(this.options.items[this.getNextItemIndex()]);
    let period = global.document.createElement('span');
    period.classList.add('text-cycle__copy__period');
    period.textContent = '.';

    fragment.appendChild(nextItemTextNode);
    fragment.appendChild(period);

    return fragment;
  }

  handleNodeTransitionEnd(event) {
    if (event.propertyName === 'opacity') {
      this.prepareNextNode();
    }
  }

  increment() {
    let hiddenNodeIndex = this.getHiddenNodeIndex();

    this.nodes[this.currentNodeIndex].classList
      .remove('text-cycle__copy--active');
    this.nodes[hiddenNodeIndex].classList.add('text-cycle__copy--active');

    this.replaceNodeContent(this.nodes.placeholder, this.getNextItemNode());

    this.currentItemIndex = this.getNextItemIndex();
    this.currentNodeIndex = hiddenNodeIndex;
  }

  init() {
    let firstItemNode = this.mountPoint.firstChild;
    let fragment = global.document.createDocumentFragment();
    let nextItemNode = global.document.createElement('span');
    let placeholderItemNode = global.document.createElement('span');

    firstItemNode.addEventListener('transitionend',
      this.handleNodeTransitionEnd.bind(this));

    nextItemNode.classList.add('text-cycle__copy');
    placeholderItemNode.classList.add('text-cycle__copy');
    placeholderItemNode.classList.add('text-cycle__copy--placeholder');

    this.replaceNodeContent(nextItemNode, this.getNextItemNode());
    placeholderItemNode.textContent = `${this.options.items[0]}.`;

    this.nodes = {
      0: firstItemNode,
      1: nextItemNode,
      placeholder: placeholderItemNode
    };

    fragment.appendChild(nextItemNode);
    fragment.appendChild(placeholderItemNode);

    this.mountPoint.insertBefore(fragment, firstItemNode);
    this.interval = global.setInterval(this.increment.bind(this),
      this.cycleLength);
  }

  prepareNextNode() {
    let nextItemNode = this.nodes[this.getHiddenNodeIndex()];
    this.replaceNodeContent(nextItemNode, this.getNextItemNode());
  }

  removeChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  replaceNodeContent(node, content) {
    this.removeChildNodes(node);
    node.appendChild(content);
  }
}
