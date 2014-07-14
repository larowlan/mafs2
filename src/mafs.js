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

require(["jquery", "Cell", "Current", "Endpoint", "GridManager", "Questions", "Selector", "Timer", "Game"], function($) {
  $(function() {
    var $operations = $('#operations').find('a');
    var $blurb = $('#blurb');
    var $timer = $('#timer');
    var $grid = $('#grid');
    var $from = $('#from');
    var $to = $('#to');
    var $current = $('#current');
    var game = window.game = new Mafs($timer, $operations, $grid, $blurb, $from, $to, $current, $.proxy);
  })
});
