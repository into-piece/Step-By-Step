console.log("begin=========bind");
Function.prototype.myBind = function () {
  var func = this;
  var args1 = [].slice.call(arguments);
  return function () {
    console.log("===============123");
    var args2 = [].slice.call(arguments);
    console.log("=======", args1, ...args1, ...args2);
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
console.log(d(123), "=====bind");

console.log("end=========bind");
