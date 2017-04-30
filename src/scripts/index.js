'use strict';

import TextCycler from './components/TextCycler';
import textCyclerItems from './constants/textCyclerItems';

class Website {
  constructor() {
    global.document.addEventListener('DOMContentLoaded', this.init);
  }

  init() {
    this.textCycler = new TextCycler({
      items: textCyclerItems,
      selector: '#text-cycle'
    });
  }
}

let website = new Website();
