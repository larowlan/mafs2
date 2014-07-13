/**
 * The Questions module is responsible for creating questions and validating
 * answers.
 *
 * @param questionEl
 * @param answerEl
 * @param buttonEl
 * @constructor
 */
function Questions(game, questionEl, buttonEl, answerEl, resultsEl, total, $) {
  this.game = game;
  this.questionEl = questionEl;
  this.answerEl = answerEl;
  this.buttonEl = buttonEl;
  this.resultsEl = resultsEl;
  this.total = total;
  this.questions = [];
  this.answers = [];
  this.proxy = $.proxy;
  this.$ = $;
  this.correct = 0;
  this.operation = '+';
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
  this.answerEl.keyup(this.proxy(this.handleKeyup, this));
  this.answerEl.keypress(this.proxy(this.handleKeypress, this));
  this.buttonEl.click(this.proxy(this.submitAnswer, this))
}

Questions.prototype.getConfig = function(operation, type) {
  return this.config[operation][type] || null;
}

Questions.prototype.reset = function(outOfTime) {
  window.clearTimeout(this.timeout);
  while (this.answers.length) {
    var $result = this.$('<div class="alert"></alert>');
    var answer = this.answers.shift();
    if (answer.right) {
      $result.addClass('alert-success');
      $result.text(answer.question + ' ' + answer.answer);
      this.correct++;
    }
    else {
      $result.addClass('alert-error');
      $result.html(answer.question + ' <del>' + answer.answer + '</del> ' + answer.correct);
    }
    this.resultsEl.append($result);
  }
  if (outOfTime) {
    this.resultsEl.prepend($('<h2></h2>').text('Time\'s Up!: ' + this.correct + ' out of ' + this.total + ' (' + Math.round(this.correct * 100/this.total) + '%)'));
  }
  else {
    this.resultsEl.prepend($('<h2></h2>').text(this.correct + ' out of ' + this.total + ' (' + Math.round(this.correct * 100/this.total) + '%)'));
  }
  this.answerEl.attr('disabled', 'disabled');
  this.buttonEl.text('Start again');
  this.buttonEl.attr('data-state', 'start');
  this.correct = 0;
}

Questions.prototype.setOperation = function(operation) {
  this.operation = operation;
  this.activeConfig = this.config[operation];
  return this;
}

Questions.prototype.handleKeyup = function(e) {
  this.timeout = window.setTimeout(this.proxy(this.autoAnswer, this), 500);
}

Questions.prototype.handleKeypress = function(e) {
  if (e.which == 13) {
    e.preventDefault();
    this.buttonEl.click();
  }
}

Questions.prototype.autoAnswer = function(e) {
  if (this.answerEl.val() == this.answer) {
    this.submitAnswer(e);
  }
}

Questions.prototype.checkAnswer = function() {
  var answer = parseInt(this.answerEl.val());
  this.answers.push({
    question: this.questionEl.text(),
    answer: answer,
    right: this.answer == answer,
    correct: this.answer
  });
  this.game.progress.incrementProgress();
}

Questions.prototype.submitAnswer = function(e) {
  if (this.game.isFirst()) {
    this.game.start();
    this.seedQuestions();
    this.resultsEl.html('');
    this.answerEl.attr('disabled', false);
    this.buttonEl.text('Next');
    this.game.timer.startTimer();
  }
  else {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.checkAnswer();
  }
  this.answerEl.focus();
  if (this.questions.length) {
    var question = this.questions.pop();
    this.questionEl.text(question.display);
    this.answer = question.answer;
    this.answerEl.val('');
  }
  else {
    this.checkAnswer();
    this.game.reset();
  }
}

Questions.prototype.seedQuestions = function() {
  this.questions = [];
  var a, b, i;
  for (i = 0; i < this.total; i++) {
    a = Math.round(this.activeConfig.max * Math.random());
    b = Math.round(this.activeConfig.max * Math.random());
    while ((this.operation == '-' && b > a) || (this.operation == '/' && (b == 0))) {
      b = Math.round(this.activeConfig.max * Math.random());
    }
    if (this.operation == '/') {
      a = b * a;
    }
    var question = {
      first: a,
      second: b,
      display: a + ' ' + this.activeConfig.display + ' ' + b + ' ='
    };
    switch (this.operation) {
      case '+':
        question.answer = parseInt(question.first) + parseInt(question.second);
        break;

      case '-':
        question.answer = parseInt(question.first) - parseInt(question.second);
        break;

      case '*':
        question.answer = parseInt(question.first) * parseInt(question.second);
        break;

      case '/':
        question.answer = parseInt(question.first) / parseInt(question.second);
        break;
    }
    this.questions.push(question);
  }
  this.answers = [];
}
