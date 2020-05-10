import { wrapAnimDelay } from './promise-utils.js';
// Ajoute les classes CSS correspondant aux animations animate.css
export function animateCSS(node, animationName, callback) {
  node.classList.add('animated', animationName);
  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);
    if (typeof callback === 'function') {
      callback();
    }
  }
  node.addEventListener('animationend', handleAnimationEnd);
}

// Autre fonction d'animations
export class SplashOverlay {
  constructor(doc, eltName) {
    this.overlayElem = doc.getElementById(eltName);
  }
  toggleDisplay() {
    return wrapAnimDelay(() => {
      if (this.overlayElem.style.display === 'none') {
        this.overlayElem.style.display = 'flex';
        animateCSS(this.overlayElem, 'slideInDown');
      } else {
        animateCSS(this.overlayElem, 'slideOutUp', () => {
          this.overlayElem.style.display = 'none';
        });
      }
    });
  }
}
