
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
