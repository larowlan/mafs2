/**
 * The Mafs module provides the main game logic.
 *
 * @param timerEl
 * @param operationsEl
 * @param blurbEl
 * @param progressEl
 * @param questionEl
 * @param buttonEl
 * @param answerEl
 * @param resultsEl
 * @param $
 * @constructor
 */
function Mafs(timerEl, operationsEl, blurbEl, progressEl, questionEl, buttonEl, answerEl, resultsEl, $) {
  this.gameTime = 180;
  this.total = 100;
  this.timer = new Timer(timerEl, this.gameTime, this, $.proxy);
  this.questions = new Questions(this, questionEl, buttonEl, answerEl, resultsEl, this.total, $);
  this.progress = new Progress(progressEl, this.total);
  this.selector = new Selector(operationsEl, blurbEl, this, $.proxy);
  this.first = true;
}

Mafs.prototype.isFirst = function() {
  return this.first;
}

Mafs.prototype.setFirst = function(value) {
  this.first = value;
  return this;
}

Mafs.prototype.reset = function(outOfTime) {
  this.progress.reset();
  this.questions.reset(outOfTime);
  this.timer.reset(outOfTime ? 'Out of time!' : 'Finished!');
  this.first = true;
  window.clearTimeout(this.finish);
}

Mafs.prototype.start = function() {
  this.setFirst(false);
  this.finish = window.setTimeout($.proxy(this.reset, this, [true]), this.gameTime * 1000);
}
