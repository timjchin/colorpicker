var ClickDownListener = function (elem, cb, context) {
  var callback = context ? cb.bind(context) : cb;

  var mouseDown = false;
  var onMouseDown = function (e) {
    mouseDown = true;
    elem.addEventListener('mousemove', callback);
    callback(e);
  };

  var onMouseUp = function (e) {
    mouseDown = false;
    elem.removeEventListener('mousemove', callback);
  };

  var onMouseLeave = function (e) {
    if (mouseDown) {
      elem.removeEventListener('mousemove', callback);
      callback(e);
      mouseDown = false;
    }
  };

  elem.addEventListener('mousedown', onMouseDown);
  elem.addEventListener('mouseup', onMouseUp);
  elem.addEventListener('mouseleave', onMouseLeave);

  return {
    off: function () {
      elem.removeEventListener('mousedown', onMouseDown);
      elem.removeEventListener('mouseup', onMouseUp);
      elem.removeEventListener('mousemove', callback);
      elem.removeEventListener('mouseleave', callback);
    },
    isDown: function () {
      return mouseDown;
    },
  };
}
module.exports = ClickDownListener;
