## 金额格式化

```
function format(number) {
  let result = null;
  const arr = String(number).split("");
  let part = [];
  if (arr.includes(".")) {
    const index = arr.indexOf(".");
    part = arr.splice(index);
  }
  console.log(arr, "===format");
  result = arr
    .reverse()
    .reduce((res, cur, index) => {
      const resLen = res.length;
      if (index % 3 === 0 && index !== 0) {
        res[resLen] = cur + ",";
      } else {
        res.push(cur);
      }
      return res;
    }, [])
    .reverse()
    .concat(part)
    .join("");

  return result;
}
```
