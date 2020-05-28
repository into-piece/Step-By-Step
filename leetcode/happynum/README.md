Write an algorithm to determine if a number is "happy".

A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy numbers.

Example:

Input: 19
Output: true
Explanation:
1^2 + 9^2 = 82
8^2 + 2^2 = 68
6^2 + 8^2 = 100
1^2 + 0^2 + 0^2 = 1

### 解析

这道题定义了一种快乐数，就是说对于某一个正整数，如果对其各个位上的数字分别平方，然后再加起来得到一个新的数字，再进行同样的操作，如果最终结果变成了 1，则说明是快乐数，如果一直循环但不是 1 的话，就不是快乐数

```
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
```
