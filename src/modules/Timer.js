/**
 * The Timer module is responsible for tracing time remaining and elapsed.
 *
 * @param element
 * @param duration
 * @param game
 * @param proxy
 * @constructor
 */
function Timer(element, duration, game, proxy) {
  /**
   * Element to render to.
   *
   * @type object
   */
  this.element = element;

  /**
   * Duration of timer.
   *
   * @type int
   */
  this.duration = duration;

  /**
   * Remaining time.
   *
   * @type int
   */
  this.remaining = duration;

  /**
   * Interval id.
   *
   * @type int
   */
  this.interval = null;

  /**
   * The current game
   *
   * @type Mafs
   */
  this.game = game;
  this.proxy = proxy;
}

Timer.prototype.incrementTimer = function() {
  this.remaining--;
  this.render();
}

Timer.prototype.render = function(message) {
  if (message) {
    this.element.text(message);
  }
  else {
    this.element.text(this.remaining + 's');
  }
}

Timer.prototype.reset = function(message) {
  this.remaining = this.duration;
  window.clearInterval(this.interval);
  this.render(message);
}

Timer.prototype.startTimer = function() {
  this.interval = window.setInterval(this.proxy(this.incrementTimer, this), 1000);
}
