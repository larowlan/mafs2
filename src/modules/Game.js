/**
 * The Mafs module provides the main game logic.
 *
 * @param timerEl
 * @param operationsEl
 * @param blurbEl
 * @param gridEl
 * @param questionEl
 * @param buttonEl
 * @param answerEl
 * @param resultsEl
 * @param $
 * @constructor
 */
function Mafs(timerEl, operationsEl, gridEl, blurbEl, fromEl, toEl, currentEl, proxy) {
  this.gameTime = 180;
  this.size = 4;
  this.timer = new Timer(timerEl, this.gameTime, this, proxy);
  this.gridManager = new GridManager(this.size, gridEl, proxy, this);
  this.questions = new Questions(this, this.size, this.gridManager);
  this.current = new Current(currentEl);
  this.from = new Endpoint(fromEl);
  this.to = new Endpoint(toEl);
  this.selector = new Selector(operationsEl, blurbEl, this, proxy);
  this.first = true;
  this.reset();
}

Mafs.prototype.isFirst = function() {
  return this.first;
}

Mafs.prototype.setFirst = function(value) {
  this.first = value;
  return this;
}

Mafs.prototype.reset = function(outOfTime) {
  this.gridManager.rebuild(this.questions.calculateValues());
  this.current.setValue(this.questions.getStart());
  this.from.setValue(this.questions.getStart());
  this.to.setValue(this.questions.getEnd());
}

Mafs.prototype.start = function() {
  this.setFirst(false);
  this.finish = window.setTimeout($.proxy(this.reset, this, [true]), this.gameTime * 1000);
}

Mafs.prototype.getOperation = function() {
  return this.questions.operation;
}

Mafs.prototype.updateCurrent = function(value) {
  this.current.updateCurrent(value, this.questions.operation);
  if (this.current.getValue() == this.to.getValue()) {
    this.reset();
  }
}

Mafs.prototype.toFar = function() {
  var currentValue = this.current.getValue();
  var target = this.questions.getEnd();
  switch(this.getOperation()) {
    case '+':
    case '*':
      return currentValue > target;

    case '-':
    case '%':
      return currentValue < target;
  }
}
