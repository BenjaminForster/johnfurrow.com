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
    const elements = global.document.querySelectorAll(this.options.selector);

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
    const fragment = global.document.createDocumentFragment();
    const nextItemTextNode = global.document.createTextNode(
      this.options.items[this.getNextItemIndex()]
    );
    const period = global.document.createElement('span');

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
    const hiddenNodeIndex = this.getHiddenNodeIndex();
    const currentNode = this.nodes[this.currentNodeIndex];
    const nextNode = this.nodes[hiddenNodeIndex];

    currentNode.classList.remove('text-cycle__copy--active');
    currentNode.classList.remove('text-cycle__copy--entering');
    currentNode.classList.add('text-cycle__copy--leaving');

    nextNode.classList.add('text-cycle__copy--active');
    nextNode.classList.add('text-cycle__copy--entering');

    this.replaceNodeContent(this.nodes.placeholder, this.getNextItemNode());

    this.currentItemIndex = this.getNextItemIndex();
    this.currentNodeIndex = hiddenNodeIndex;
  }

  init() {
    const firstItemNode = this.mountPoint.firstChild;
    const fragment = global.document.createDocumentFragment();
    const nextItemNode = global.document.createElement('span');
    const placeholderItemNode = global.document.createElement('span');

    firstItemNode.addEventListener(
      'transitionend',
      this.handleNodeTransitionEnd.bind(this)
    );

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
    this.interval = global.setInterval(
      this.increment.bind(this),
      this.cycleLength
    );
  }

  prepareNextNode() {
    const nextItemNode = this.nodes[this.getHiddenNodeIndex()];

    nextItemNode.classList.remove('text-cycle__copy--leaving');
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
