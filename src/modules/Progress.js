/**
 * The Progess module is responsible for tracking game progress.
 *
 * @param progressEl
 * @param total
 * @constructor
 */
function Progress(progressEl, total) {
  this.progressEl = progressEl;
  this.progress = 0;
  this.total = total;
}

/**
 * Updates the progress.
 */
Progress.prototype.incrementProgress = function() {
  this.progress++;
  this.updateMeter(this.getPercent());
}

/**
 * Updates the progress element.
 *
 * @param percent
 */
Progress.prototype.updateMeter = function(percent) {
  this.progressEl.css('width', percent + '%');
}

/**
 * Returns the percent progress
 *
 * @returns int
 */
Progress.prototype.getPercent = function() {
  return Math.round(this.progress * 100 / this.total);
}

/**
 * Resets the progress component.
 */
Progress.prototype.reset = function() {
  this.progress = 0;
  this.progressEl.css('width', '0%');
}
