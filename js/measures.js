import { SplashOverlay } from './animate.js';

export class MeasuresOverlay extends SplashOverlay {
  constructor(doc) {
    super(doc, 'measures-overlay');
  }
}

export class EndOverlay extends SplashOverlay {
  constructor(doc) {
    super(doc, 'end-overlay');
  }
}
