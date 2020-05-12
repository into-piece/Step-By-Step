Function.prototype.myBind = function () {
  var func = this;
  var args1 = [].slice.call(arguments);
  return function () {
    var args2 = [].slice.call(arguments);
    return func.call(...args1, ...args2);
  };
};

function a() {
  console.log(this.c);
  return this.c;
}
const b = {
  c: 1,
};

const d = a.myBind(b, 123);
