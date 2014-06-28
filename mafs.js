$ = jQuery;

/*
 @todo Progress bar
 */

jQuery(function() {

  var $button, $answer, $question, $results, questions = [], answers = [],
    question, $result, answer, first = true, correct = 0, total = 20, i, a, b,
    timeout, time = 80, timer, remaining = time, $progress, progress = 0,
    countdownTimer, operation = '+', $operations, $selected, $blurb, config = {
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
  var activeConfig = config['+'];
  $button = $('#submit');
  $answer = $('#answer');
  $question = $('#question');
  $results = $('#results');
  $progress = $('#progress');
  $operations = $('#operations').find('a');
  $blurb = $('#blurb');

  $operations.click(function() {
    $selected = $(this);
    operation = $selected.attr('data-operation');
    $('#operations').find('li').removeClass('active');
    $selected.parent().addClass('active');
    if (!first) {
      finish();
    }
    resetProgress();
    activeConfig = config[operation];
    $blurb.text($selected.text() + ' practice ' + activeConfig.min + '-' + activeConfig.max);
  });

  function seedQuestions() {
    questions = [];
    for (i = 0; i < total; i++) {
      a = Math.round(activeConfig.max * Math.random());
      b = Math.round(activeConfig.max * Math.random());
      while ((operation == '-' && b > a) || (operation == '/' && (b == 0))) {
        b = Math.round(activeConfig.max * Math.random());
      }
      if (operation == '/') {
        a = b * a;
      }
      questions.push({
        first: a,
        second: b
      });
    }
    answers = [];
  }

  function finish(outOfTime) {
    window.clearTimeout(timeout);
    while (answers.length) {
      $result = $('<div class="alert"></alert>');
      answer = answers.shift();
      if (answer.right) {
        $result.addClass('alert-success');
        $result.text(answer.question + ' ' + answer.answer);
        correct++;
      }
      else {
        $result.addClass('alert-error');
        $result.html(answer.question + ' <del>' + answer.answer + '</del> ' + answer.correct);
      }
      $results.append($result);
    }
    if (outOfTime) {
      $results.prepend($('<h2></h2>').text('Time\'s Up!: ' + correct + ' out of ' + total + ' (' + Math.round(correct * 100/total) + '%)'));
      $('#timer').text('Out of time!');
    }
    else {
      $results.prepend($('<h2></h2>').text(correct + ' out of ' + total + ' (' + Math.round(correct * 100/total) + '%)'));
    }
    $answer.attr('disabled', 'disabled');
    $button.text('Start again');
    $button.attr('data-state', 'start');
    first = true;
    correct = 0;
    progress = 0;
    remaining = time;
    window.clearInterval(countdownTimer);
    window.clearTimeout(timer);
  }

  function incrementProgress() {
    progress++;
    $progress.css('width', Math.round(progress * 100/total) + '%');
  }

  function resetProgress() {
    $progress.css('width', '0%');
  }

  function evaluateAnswer() {
    answers.push({
      question: $question.text(),
      answer: $answer.val(),
      right: parseInt($question.attr('data-answer')) == parseInt($answer.val()),
      correct: parseInt($question.attr('data-answer'))
    });
    incrementProgress();
  }

  $(window).keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      $button.click();
    }
  });

  $answer.keyup(function(e) {
    timeout = window.setTimeout(function () {
    if ($answer.val() == $question.attr('data-answer')) {
      $button.click();
    }}, 500);
  });
  $button.click(function() {
    $answer.focus();
    if (!first && $answer.val() == '') {
      // No null submissions.
      return;
    }
    window.clearTimeout(timeout);
    if ($button.attr('data-state') == 'start') {
      $button.attr('data-state', 'running');
      first = true;
      seedQuestions();
      $results.html('');
      $answer.attr('disabled', false);
      $button.text('Next');
      timer = window.setTimeout(function() {
        finish(true);
      }, time * 1000);
      countdownTimer = window.setInterval(function() {
        remaining--;
        $('#timer').text(remaining + 's');
      }, 1000);
    }
    if (questions.length) {
      question = questions.pop();
      if (!first) {
        evaluateAnswer();
      }
      $question.text(question.first + ' ' + activeConfig.display + ' ' + question.second + ' =');
      switch (operation) {
        case '+':
          $question.attr('data-answer', parseInt(question.first) + parseInt(question.second));
          break;

        case '-':
          $question.attr('data-answer', parseInt(question.first) - parseInt(question.second));
          break;

        case '*':
          $question.attr('data-answer', parseInt(question.first) * parseInt(question.second));
          break;

        case '%':
          $question.attr('data-answer', parseInt(question.first) / parseInt(question.second));
          break;

      }
      $answer.val('');
      first = false;
    }
    else {
      evaluateAnswer();
      $('#timer').text('Finished!');

      finish();
    }
  })

});
