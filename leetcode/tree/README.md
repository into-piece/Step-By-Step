```
function treeNode(v){
  this.value = v
  this.left = this.right = null
}

const root = {
  val: "A",
  left: {
    val: "B",
    left: {
      val: "D"
    },
    right: {
      val: "E"
    }
  },
  right: {
    val: "C",
    right: {
      val: "F"
    }
  }
};

// 树的前序遍历
// 先根节点 =》 左节点 =》 右节点
// 相当于深度优先遍历
function frondMap(tree){
  if(!tree) return
  console.log('当前遍历的结点值是：' + tree.val)
  frondMap(tree.left)
  frondMap(tree.right)
}

// 中序遍历
function middleMap(tree){
  if(!tree) return
  frondMap(tree.left)
  console.log('当前遍历的结点值是：' + tree.val)
  frondMap(tree.right)
}

// 后序遍历
function backMap(tree){
  if(!tree) return
  frondMap(tree.left)
  frondMap(tree.right)
  console.log('当前遍历的结点值是：' + tree.val)
}
```
