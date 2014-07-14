function Endpoint(el) {
  this.el = el;
  this.value = '';
}

Endpoint.prototype.getValue = function() {
  return this.value;
}

Endpoint.prototype.setValue = function(value) {
  this.value = value;
  this.el.text(value);
}
