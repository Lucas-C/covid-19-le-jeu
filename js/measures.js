import { animateCSS } from './animate.js';

export class MeasuresOverlay {
  constructor(doc) {
    this.overlayElem = doc.getElementById('measures-overlay');
  }
  toggleDisplay() {
    if (this.overlayElem.style.display === 'none') {
      this.overlayElem.style.display = 'flex';
      animateCSS(this.overlayElem, 'slideInDown');
    } else {
      animateCSS(this.overlayElem, 'slideOutUp', () => {
        this.overlayElem.style.display = 'none';
      });
    }
  }
}
