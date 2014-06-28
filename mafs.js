$ = jQuery;
jQuery(function() {

  var $button, $answer, $question, $results, questions = [], answers = [], question, $result, answer, first = true;
  $button = $('#submit');
  $answer = $('#answer');
  $question = $('#question');
  $results = $('#results');

  function seedQuestions() {
    var min = 0, max = 20, i, a, b;
    questions = [];
    for (i = 0; i < 5; i++) {
      a = Math.round(max * Math.random());
      b = Math.round(max * Math.random());
      while (b > a) {
        b = Math.round(max * Math.random());
      }
      questions.push({
        from: a,
        take: b
      });
    }
    answers = [];
  }

  $(window).keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      $button.click();
    }
  });
  $button.click(function() {
    if ($button.attr('data-state') == 'start') {
      $button.attr('data-state', 'running');
      first = true;
      seedQuestions();
      $results.html('');
      $answer.attr('disabled', false);
      $button.text('Next');
    }
    if (questions.length) {
      question = questions.pop();
      if (!first) {
        answers.push({
          question: $question.text(),
          answer: $answer.val(),
          right: parseInt($question.attr('data-answer')) == parseInt($answer.val()),
          correct: parseInt($question.attr('data-answer'))
        });
      }
      $question.text(question.from + ' - ' + question.take + ' =');
      $question.attr('data-answer', parseInt(question.from) - parseInt(question.take));
      $answer.val('');
      first = false;
    }
    else {
      // All questions done.
      while (answers.length) {
        $result = $('<div class="alert"></alert>');
        answer = answers.shift();
        if (answer.right) {
          $result.addClass('alert-success');
          $result.text(answer.question + ' ' + answer.answer);
        }
        else {
          $result.addClass('alert-error');
          $result.html(answer.question + '<del>' + answer.answer + '</del> ' + answer.correct);
        }
        $results.append($result);
      }
      $answer.attr('disabled', true);
      $button.text('Start again');
      $button.attr('data-state', 'start');
      first = true;
    }
  })

});
