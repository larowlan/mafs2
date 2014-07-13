requirejs.config({
  "baseUrl": "src/modules",
  "paths": {
    "jquery": "//code.jquery.com/jquery"
  }
});

/**
 * @todo
 * - grunt to minify and build
 * - qunit tests
 * - decouple results component
 * - fix 'blurb' text is wrong after tab change
 */

require(["jquery", "Progress", "Questions", "Selector", "Timer", "Game"], function($) {
  $(function() {
    var $button = $('#submit');
    var $answer = $('#answer');
    var $question = $('#question');
    var $results = $('#results');
    var $progress = $('#progress');
    var $operations = $('#operations').find('a');
    var $blurb = $('#blurb');
    var $timer = $('#timer');
    var game = new Mafs($timer, $operations, $blurb, $progress, $question, $button, $answer, $results, $);
  })
});
