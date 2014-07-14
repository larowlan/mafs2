function Current(el) {
  this.el = el;
  this.value = '';
}

Current.prototype.getValue = function() {
  return this.value;
}

Current.prototype.setValue = function(value) {
  this.value = value;
  this.el.text(value);
}

Current.prototype.updateCurrent = function(value, operation) {
  var val = this.value;
  switch (operation) {
    case '+':
      val = val + value;
      break;

    case '-':
      val = val - value;
      break;

    case '*':
      val = val * value;
      break;

    case '/':
      val = val / value;
      break;
  }
  this.setValue(val);
}
