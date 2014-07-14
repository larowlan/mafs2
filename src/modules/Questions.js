/**
 * The Questions module is responsible for creating questions and validating
 * answers.
 * @constructor
 */
function Questions(game, size, gridManager) {
  this.game = game;
  this.size = size;
  this.values = [];
  this.start = 0;
  this.end = 0;
  this.lengthPool = [];
  this.operation = '+';
  this.answer = [];
  this.gridManager = gridManager;
  this.config = {
    '+' : {
      min: 0,
      max: 20,
      display: '+'
    },
    '-' : {
      min: 0,
      max: 20,
      display: '-'
    },
    '*' : {
      min: 0,
      max: 10,
      display: 'x'
    },
    '/' : {
      min: 0,
      max: 10,
      display: '/'
    }
  };
  this.activeConfig = this.config[this.operation];
  this.timeout = null;
}

Questions.prototype.getConfig = function(operation, type) {
  return this.config[operation][type] || null;
}

Questions.prototype.reset = function(outOfTime) {
  window.clearTimeout(this.timeout);
  this.calculateValues();
}

Questions.prototype.setOperation = function(operation) {
  this.operation = operation;
  this.activeConfig = this.config[operation];
  return this;
}

Questions.prototype.calculateValues = function() {
  this.values = [];
  // # of moves.
  var gridMoves = this.randomLength();
  // # of vertical moves.
  var verticalMoves = gridMoves - this.size;
  // Vertical move pool.
  var verticalMovePool = [], i, random, moveStack = [], tileValue, balance,
    maxVertical = 1, maxVerticalColumn = 1, address, origin, adj, colDirections,
    direction, colDirection;
  while (verticalMovePool.length < this.size) {
    verticalMovePool.push(1);
  }
  for (i = 0; i < verticalMoves; i++) {
    // Random index for p.
    random = Math.round(Math.random() * this.size);
    while (verticalMovePool[random] > this.size) {
      random = Math.round(Math.random() * this.size);
    }
    verticalMovePool[random]++;
    if (verticalMovePool[random] > maxVertical) {
      maxVertical = verticalMovePool[random];
      maxVerticalColumn = random;
    }
  }
  // p now contains number of vertical moves required for each column.
  // Build the end point, start points and series.
  switch (this.operation) {
    case '+':
    case '-':
      // Max is .5 to 2 times the maximum times the length of the path.
      this.end = Math.round(this.getConfig(this.operation, 'max') * gridMoves * 5 / (Math.floor(Math.random() * 20) + 5));
      this.start = Math.floor(Math.random() * this.getConfig(this.operation, 'max')) + this.getConfig(this.operation, 'min');
      balance = this.end - this.start;
      while (moveStack.length < gridMoves) {
        if (moveStack.length == (gridMoves - 1)) {
          tileValue = balance;
        }
        else {
          tileValue = Math.min(balance, Math.floor(Math.random() * Math.min(this.getConfig(this.operation, 'max'), balance) + this.getConfig(this.operation, 'min')));
        }
        moveStack.push(tileValue);
        balance -= tileValue;
      }
      break;

    case '*':
    case '%':
      break;
  }

  this.answer = moveStack.slice(0);

  colDirections = [
    ['nsw', 'nsw', 'nsw', 'reset'],
    ['nse', 'reset', 'nsw', 'nsw'],
    ['nse', 'nse', 'reset', 'nsw'],
    ['nse', 'nse', 'nse', 'reset']
  ]

  // Start with c.
  if (maxVertical > this.size / 2) {
    // We have to start on an edge in maxVertical column.
    if (Math.random() > 0.5) {
      // Start on top edge.
      origin = {
        x: maxVerticalColumn,
        y: 0
      };
      colDirection = 'new';
    }
    else {
      // Start on bottom edge.
      origin = {
        x: maxVerticalColumn,
        y: this.size - 1
      };
      colDirection = 'sew';
    }
  }
  else {
    // We can start anywhere in maxVertical column.
    origin = {
      x: maxVerticalColumn,
      y: Math.floor(Math.random() * this.size)
    };
    if (Math.random() > 0.5) {
      colDirection = 'new';
    }
    else {
      colDirection = 'sew';
    }
  }
  address = origin;
  // Handle the col with the most vertical moves.
  while (moveStack.length && verticalMovePool[address.x] > 0) {
    tileValue = moveStack.pop();
    if (typeof this.values[address.x] == 'undefined') {
      this.values[address.x] = [];
    }
    this.values[address.x][address.y] = tileValue;
    verticalMovePool[address.x]--;
    if (verticalMovePool[address.x] > 0) {
      address = this.gridManager.calculateAdjacent(address.x, address.y, colDirection).shift();
    }
  }
  // Now refer to colOrder.
  for (i = 0; i < 4; i++) {
    if (!address) {
      continue;
    }
    direction = colDirections[origin.x][i];
    if (direction == 'reset') {
      address = origin;
      continue;
    }
    address = this.gridManager.calculateAdjacent(address.x, address.y, direction).shift();
    colDirection = 'new';
    if ((address.y + verticalMovePool[address.x]) > this.size) {
      colDirection = 'sew';
    }
    if (address) {
      while (moveStack.length && verticalMovePool[address.x] > 0) {
        tileValue = moveStack.pop();
        if (typeof this.values[address.x] == 'undefined') {
          this.values[address.x] = [];
        }
        this.values[address.x][address.y] = tileValue;
        verticalMovePool[address.x]--;
        if (verticalMovePool[address.x] > 0) {
          address = this.gridManager.calculateAdjacent(address.x, address.y, colDirection);
          if (Math.random() > 0.5) {
            address = address.pop();
          }
          else {
            address = address.shift();
          }
        }
      }
    }
  }
  // We should now have the moves filled. Fill the rest with random.
  for (i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      if (typeof this.values[i] == 'undefined') {
        this.values[i] = [];
      }
      if (typeof this.values[i][j] == 'undefined') {
        this.values[i][j] = Math.floor(Math.random() * this.getConfig(this.operation, 'max')) + this.getConfig(this.operation, 'min');
      }
    }
  }
  return this.values;
}

Questions.prototype.randomLength = function(reset) {
  if (this.lengthPool.length == 0 || reset) {
    this.lengthPool = [];
    var i = this.size, j;
    while (i <= Math.pow(this.size, 2)) {
      for (j = this.size; j <= i; j++) {
        this.lengthPool.push(j);
      }
      i++;
    }
  }
  var ix = Math.round(Math.random() * this.lengthPool.length);
  return this.lengthPool[ix];
}

Questions.prototype.getValues = function() {
  return this.values;
}

Questions.prototype.getStart = function() {
  return this.start;
}

Questions.prototype.getEnd = function() {
  return this.end;
}
