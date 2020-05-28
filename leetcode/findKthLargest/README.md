> https:>leetcode-cn.com/problems/kth-largest-element-in-an-array/
> 在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

> 示例 1:
> 输入: [3,2,1,5,6,4] 和 k = 2
> 输出: 5
> 示例  2:

> 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
> 输出: 4
> 说明:
> 你可以假设 k 总是有效的，且 1 ≤ k ≤ 数组的长度。

```
function findKthLargest(arr, num) {
  function quicksort(arr) {
    if (arr.length < 2) return arr;
    const len = arr.length;
    const last = arr[len - 1];
    const left = arr.filter((i, index) => i <= last && index !== len - 1);
    const right = arr.filter((i) => i > last);
    return [...sort(left), last, ...sort(right)];
  }

  const sortArr = arr.sort(function (a, b) {
    return a - b;
  });
  return sortArr[sortArr.length - num];
}

const a = findKthLargest([1, 3, 3, 2, 2], 1);

function findKthLargest1(arr, num) {
  function quicksort(arr) {
    const len = arr.length;
    if (len < 2) return arr;
    const last = arr[len - 1];
    let left = [];
    let right = [];
    for (let i = 0; i < len; i++) {
      if (i === len - 1) break;
      if (arr[i] <= last && i !== len - 1) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return [...quicksort(left), last, ...quicksort(right)];
  }

  const sortArr = quicksort(arr);
  return sortArr[sortArr.length - num];
}

function findKthLargest2(arr, num) {
  const sortArr = arr.sort(function (a, b) {
    return a - b;
  });
  return sortArr[sortArr.length - num];
}



// 创建一个大顶堆，将所有数组中的元素加入堆中，并保持堆的大小小于等于 k。这样，堆中就保留了前 k 个最大的元素。这样，堆顶的元素就是正确答案。
// function findKthLargest3(arr, num) {
//   class Heap {
//     stack = [];
//     swap(num1, num2) {
//       // const [num1.num2] = [num2,num1]
//     }
//     push(num) {
//       this.stack.push;
//     }
//   }

//   const heap = new Heap();
// }

```
