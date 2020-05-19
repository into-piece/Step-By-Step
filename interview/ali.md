# 阿里一面
## 一、数组转树状结构
```
 function  listToTree(list)  {
  // your code here
 }

 var  list  =  [
     {id:  2,  name: 'declare', parent:  0},
     {id:  30,  name: 'gps', parent:  0},
     {id:  4,  name: 'gui', parent:  1},
     {id:  5,  name: 'http', parent:  1},
     {id:  0,  name: 'api', parent:  null},
     {id:  1,  name: 'fetch', parent:  null},
     {id:  6,  name: 'lcd', parent:  1},
     {id:  31,  name: 'led', parent:  3},
     {id:  32,  name: 'mips', parent:  3},
     {id:  33,  name: 'dram', parent:  3},
     {id:  41,  name: 'dns', parent:  31},
     {id:  42,  name: 'cros', parent:  31},
 ];

 console.log(listToTree(list));
```
俺的答案：

```
function listToTree(nums, parent = null){
  return nums.filter(item => item.parent === parent).map(subItem=>({
      ...subItem,
      children: listToTree(nums, subItem.id)
  }))
}
```

## 实现一个缓存模块

实现一个前端缓存模块，主要用于缓存 xhr 返回的结果，避免多余的网络请求浪费

要求
1. 生命周期为一次页面打开
2. 如果有相同的请求同时并行发起，要求其中一个能挂起并且等待另外一个请求返回并读取该缓存

答案：就是promise的变型。


```
class cacheControl {
  reqList = []
  value = null
  constructor(func){
    this.reqList.push(func)
  }
  getValue(){
      if(this.value) return this.value
  }
  addReq(func){
    this.reqList.push(func)
  }
  async action(){
    this.reqList.forEach(req=> {
        this.value = await req() 
      })
  }
}

```



