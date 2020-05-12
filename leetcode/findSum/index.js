// 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标
// 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素
function findSum(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    const restNum = target - arr[i];
    const restIndex = arr.indexOf(restNum);
    if (restIndex !== -1 && restIndex !== i) {
      return { nums: [arr[i], restNum], index: [i, restIndex] };
    }
  }
}

const a = findSum([2, 7, 11, 15], 9);
console.log(a);

//执行用时 :68 ms, 在所有 JavaScript 提交中击败了84.86%的用户
//内存消耗 :35.1 MB, 在所有 JavaScript 提交中击败了43.22%的用户
var twoSum = function (nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const restNum = target - nums[i];
    if (map.has(restNum)) {
      return [i, map.get(restNum)];
    }
    map.set(nums[i], i);
  }
};
