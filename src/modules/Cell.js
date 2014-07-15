/**
 * Defines cell object.
 */
function Cell(manager, value, el, x, y, proxy) {
  this.value = value;
  this.el = el;
  this.manager = manager;
  el.find('.inner').text(value);
  this.x = x;
  this.y = y;
  this.proxy = proxy;
  this.last = null;
  this.state = '';
}

Cell.prototype.setState = function(state) {
  this.state = state;
  this.el.attr('class', state);
};

Cell.prototype.disable = function() {
  this.el.unbind('click.mafs');
}

Cell.prototype.enable = function(callback) {
  this.el.bind('click.mafs', this.proxy(callback, this.manager, this));
}

Cell.prototype.getValue = function() {
  return this.value;
}

Cell.prototype.getManager = function() {
  return this.manager;
}

Cell.prototype.getX = function() {
  return this.x;
}

Cell.prototype.getY = function() {
  return this.y;
}

Cell.prototype.setLast = function(cell) {
  this.last = cell;
  return this;
}

Cell.prototype.getLast = function() {
  return this.last;
}

Cell.prototype.hasState = function(state) {
  return this.state == state;
}
