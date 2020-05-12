// var isHappy = (function () {
//   const list = new Set();
//   return (func = function (n) {
//     const num = n
//       .toString()
//       .split("")
//       .reduce((res, cur) => {
//         res += Math.pow(cur, 2);
//         return res;
//       }, 0);

//     if (list.has(num)) return false;
//     if (num === 1) {
//       return true;
//     }
//     list.add(num);
//     return func(num);
//   });
// })();

var isHappy = function (n) {
  let num,
    set = new Set();
  n += "";
  while (num != 1) {
    num = 0;
    for (let i = 0; i < n.length; i++) {
      num += n[i] * n[i];
    }
    if (set.has(num)) return false;
    set.add(num);
    n = num += "";
  }
  return true;
};

console.log(isHappy(19));
