function Tree() {
  function Node(element) {
    this.element = element;
    this.letf = null;
    this.right = null;
  }
  var root = null;
}

// 前序遍历
Tree.prototype.preOrderTraverse = function (callback) {
  preOrder(node, callback);
  var preOrder = function (node, callback) {
    if (node !== null) {
      callback(node);
      preOrder(node.left, callback);
      preOrder(node.right, callback);
    }
  };
};

// 前序 不递归 用栈
Tree.prototype.preOrderTraverse = function (callback) {
  let stack = []
  while()

}