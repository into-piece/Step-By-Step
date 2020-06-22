Given a 2D binary matrix filled with 0's and 1's, find the largest square containing all 1's and return its area.

For example, given the following matrix:

1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
Return 4.

```
console.log(1, "===========dp");
var maximalSquare = function (matrix) {
  let maxSide = 0;
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return maxSide;
  const row = matrix.length;
  const column = matrix[0].length;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      // 把这个当作左上角
      if (matrix[i][j] == "1") {
        // 最大的边
        const currentMaxSize = Math.min(row - i, column - j);
        if (row === 1) {
          console.log("============", "row", "[[1]]", currentMaxSize);
        }
        for (let k = 1; k < currentMaxSize; k++) {
          let isBreak = true;
          // 先找出对应最下角的坐标 为0直接退出
          if (matrix[i + k][j + k] == "0") {
            break;
          }
          // 查看边上的所有元素是否全为1
          for (let m = 0; m < k; m++) {
            if (matrix[i + m][j + k] == "0" || matrix[i + k][j + m] == "0") {
              isBreak = false;
              break;
            }
          }
          if (isBreak) {
            console.log(i, "i", j, "j", maxSide, "maxSide");
            maxSide = Math.max(maxSide, k + 1);
          } else {
            break;
          }
        }
      }
    }
  }
  return Math.pow(maxSide, 2);
};

const a = maximalSquare([
  ["1", "0", "1", "0", "0"],
  ["1", "0", "1", "1", "1"],
  ["1", "1", "1", "1", "1"],
  ["1", "0", "0", "1", "0"],
]);
const b = maximalSquare([[1]]);
console.log("result", a, b);
console.log(2, "===========dp");
```