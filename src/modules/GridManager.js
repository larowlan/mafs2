/**
 * Defines grid manager.
 */

function GridManager(size, el, proxy, game) {
  this.size = size;
  this.el = el;
  this.cells = [];
  this.proxy = proxy;
  this.game = game;
  this.head = null;
  this.enabled = [];
}

GridManager.prototype.rebuild = function(values) {
  var i, j, c, o;
  for (i in this.cells) {
    if (this.cells.hasOwnProperty(i)) {
      for (j in this.cells[i]) {
        if (this.cells[i].hasOwnProperty(j)) {
          this.cells[i][j].disable();
          this.cells[i][j].setState('');
        }
      }
    }
  }
  this.cells = [];
  for (i = 0; i < this.size; i++) {
    for (j = 0; j < this.size; j++) {
      if (j == 0) {
        o = 1;
      }
      else {
        o = 0;
      }
      c = this.el.find('tr').eq(j).find('td').eq(i + o);
      if (typeof this.cells[i] == 'undefined') {
        this.cells[i] = [];
      }
      this.cells[i][j] = new Cell(this, values[i][j], c, i + 0, j, this.proxy);
      if (i == 0) {
        this.cells[i][j].enable(this.cellClicked);
        this.enabled.push(this.cells[i][j]);
        this.cells[i][j].setState('adjacent');
      }
    }
  }
};

GridManager.prototype.cellClicked = function(cell) {
  var x = cell.getX();
  var y = cell.getY();
  var i, c;
  for (i in this.enabled) {
    if (this.enabled.hasOwnProperty(i)) {
      if (!this.enabled[i].hasState('selected') && !this.enabled[i].hasState('invalid')) {
        this.enabled[i].setState('');
        this.enabled[i].disable();
      }
    }
  }
  this.enabled = [];
  this.game.updateCurrent(cell.getValue());
  cell.setState('selected');
  if (this.game.toFar()) {
    cell.setState('invalid');
  }
  var adjacent = this.calculateAdjacent(x, y);
  for (i in adjacent) {
    if (adjacent.hasOwnProperty(i)) {
      c = this.cells[adjacent[i].x][adjacent[i].y]
      if (!c.hasState('selected') && !c.hasState('invalid')) {
        c.setState('adjacent');
        c.enable(this.cellClicked);
        this.enabled.push(c);
      }
    }
  }
  cell.setLast(this.head);
  this.head = cell;
  cell.enable(this.cellReset);
  this.enabled.push(cell);
};

GridManager.prototype.cellReset = function(cell) {
  cell.setState('');
  if (cell.getLast()) {
    this.cellClicked(cell.getLast());
  }
};

GridManager.prototype.calculateAdjacent = function(x, y, exclude) {
  exclude = exclude || '';
  var adjacent = [];
  if (exclude.indexOf('w') == -1) {
    // Left.
    if (x - 1 >= 0) {
      adjacent.push({
        x: x - 1,
        y: y
      })
    }
  }
  if (exclude.indexOf('e') == -1) {
    // Right.
    if (x + 1 < this.size) {
      adjacent.push({
        x: x + 1,
        y: y
      })
    }
  }
  if (exclude.indexOf('n') == -1) {
    // Above.
    if (y - 1 >= 0) {
      adjacent.push({
        x: x,
        y: y - 1
      })
    }
  }
  if (exclude.indexOf('s') == -1) {
    // Below.
    if (y + 1 < this.size) {
      adjacent.push({
        x: x,
        y: y + 1
      })
    }
  }
  return adjacent;
};
