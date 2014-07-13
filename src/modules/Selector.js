/**
 * The selector module is reponsible for setting the game mode.
 *
 * @param operationsEl
 * @param blurbEl
 * @param game
 * @constructor
 */

function Selector(operationsEl, blurbEl, game, proxy) {
  this.operationsEl = operationsEl;
  this.blurbEl = blurbEl;
  this.proxy = proxy;
  this.game = game;
  this.operationsEl.click(this.proxy(this.changeOperation, this));
}

Selector.prototype.changeOperation = function(e) {
  var $selected = $(e.target);
  var operation = $selected.attr('data-operation');
  this.game.questions.setOperation(operation);
  this.operationsEl.parents('li').removeClass('active');
  $selected.parent().addClass('active');
  if (!this.game.isFirst()) {
    this.game.reset();
  }
  this.updateBlurb($selected.text(), operation);
};

Selector.prototype.updateBlurb = function(text, operation) {
  this.blurbEl.text(text + ' practice ' + this.game.questions.getConfig(operation, 'min') + '-' + this.game.questions.getConfig(operation, 'max'));
}
