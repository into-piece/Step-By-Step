// 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
// 说明: 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

// 示例: 输入:
// nums1 = [1,2,3,0,0,0], m = 3
// nums2 = [2,5,6], n = 3
// 输出: [1,2,2,3,5,6]


// 双指针法
function merge(nums1,m,nums2,n){
  let i = m-1,
  j = n-1,
  k = n+m-1
  while(i>=0&&j>=0){
    if(nums1[i]>=num2[j]){
      nums1[k] = nums1[i]
      i--
      k--
    }else{
      nums1[k] = num2[j]
      j--
      k--
    }
  }
  while(j>=0) {
    nums1[k] = nums2[j]  
    k-- 
    j--
  }
}


// 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
// 注意：答案中不可以包含重复的三元组。

// 示例: 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]

// 思路 =》双指针法
// 双指针法中的“对撞指针”法
// 先固定一个指针i 其余两个一个i+1 一个len-1 三者相加的值与target值进行比较，判断是否向中收缩
const threeSum = function(nums) {
  const len = nums.length,
        target = 0
  nums = nums.sort((a,b)=>{
    return a-b
  })
  console.log(nums,'========threeSumValue')
  let res = []
  for(let i =0;i<len;i++){
    let j = i+1,
        k = len-1
    while(j<k){
      // 值过大 k指针往前
      if(nums[i]+nums[j]+nums[k] > target){
        console.log(i,j,k)
        k--
        // 处理左指针元素重复的情况
        while(j<k&&nums[k]===nums[k-1]) {
          k--
        }
      }
      // 值过于小 k指针往前
      else if(nums[i]+nums[j]+nums[k] < target){
        j++
        // 处理左指针元素重复的情况
        while(j<k&&nums[j]===nums[j+1]) {
          j++
      }
      }
      // 获取成功
      else{
        res.push([nums[i],nums[j],nums[k]])
        k--
        j++

        // 若左指针元素重复，跳过
        while(j<k&&nums[j]===nums[j-1]) {
          j++
        }  
     
        // 若右指针元素重复，跳过
        while(j<k&&nums[k]===nums[k+1]) {
          k--
        }
      }
    }
  }
  return res
}

const threeSumValue = threeSum([-1, 0, 1, 2, -1, -4])
console.log(threeSumValue,'=======threeSumValue')



// 判断是否回文字符
function isHuiwen(str){
  str === str.split('').reverse().joint('')
}

function isHuiwen(str){
  const len = str.length
  let flag = true
  for(let i=0;i<len/2;i++){
    if(str[i] !== str[len-i-1]){
      flag = false
    }
  }
  return flag
}
