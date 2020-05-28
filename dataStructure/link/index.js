/*
 * @Author: your name
 * @Date: 2020-05-20 16:06:14
 * @LastEditTime: 2020-05-21 08:58:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/src/leetcode/link/index.js
 */ 

// 将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有结点组成的。
// 示例： 输入：1->2->4, 1->3->4 输出：1->1->2->3->4->4

function ListNode(){
  this.val = null
  this.next = null
}

function sumLink(l1, l2){
  let current = new ListNode()
  while(l1 && l2){
    if(l1>l2){
      current.next = l2
      l2 = l2.next
    }else{
      current.next = l1
      l1 = l1.next
    }
    current = current.next
  }
  
  // 处理链表不等长的情况
  cur.next = l1!==null?l1:l2

  return current.next
}
sumLink()


// 给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
const deleteDuplicates = function(head) {
  let cur = head
  while(cur && cur.next){
    if(cur.val === cur.next.val){
      cur.next = cur.next.next
    }else{
      cur = cur.next
    }
  }
}

//给定一个排序链表，删除所有含有重复数字的结点，只保留原始链表中 没有重复出现的数字。
// 示例 1:
// 输入: 1->2->3->3->4->4->5
// 输出: 1->2->5
// 示例 2:
// 输入: 1->1->1->2->3
// 输出: 2->3

const deleteDuplicates = function(head) {
  let cur = head
  while(cur.next && cur.next.next){
    if(cur.next.val === cur.next.next.val){
      let value = cur.next.val 
      // 这一步就很鸡贼 如果有  1->1->1->2->3，这样子cur.next = cur.next.next.next是解决不了问题的
      while(cur.next && cur.next.val === value){
        cur.next = cur.next.next 
      }
    }else{
      cur = cur.next
    }
  }
}


// 给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
// 示例： 给定一个链表: 1->2->3->4->5, 和 n = 2.
// 当删除了倒数第二个结点后，链表变为 1->2->3->5.
// 说明： 给定的 n 保证是有效的。

// 给定一个快慢指针，快指针先于慢指针走n步，当快指针到尾部的时候，慢指针就刚好到达倒数第n
const removeNthFromEnd = function(head, n) {
  let dummy = new ListNode()
  dummy.next = head
  let fast = dummy
  let slow = dummy

  while(n!==0){
    fast = fast.next
    n--
  }
  while(fast){
    fast = fast.next
    slow = slow.next
  }

  slow.next = slow.next.next

  return dummy.next

}

//定义一个函数，输入一个链表的头结点，反转该链表并输出反转后链表的头结点。
// 输入: 1->2->3->4->5->NULL
// 输出: 5->4->3->2->1->NULL

function reverseLink (head){
  let cur = head,
      pre = null
  while(cur){
    let next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }
  return pre
}

// 反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。
function reverseBetween(head, m, n) {
  let dommy = new ListNode()
  dommy.next = head
  let cur = dommy,
      pre = null;
      prehead = null

  const index = m - n
  while (m!==0){
    m--
    cur = cur.next
  }

  // prehead存储反转的开头
  prehead = cur
  let start = cur.next
  // 从这里开始反转
  pre = start
  // 这里为当前
  cur = pre.next

  while (index !== 0 && cur){
    let next = cur.next
    cur.next = pre
    pre = cur
    cur = next
    index--
  }

  leftHead.next = pre
  start.next = cur
  return dommy.next
}

// 递归
var reverseList = function (cur,pre=null) {
  if (head === null || head.next === null) {
    return head
  }

  if (cur || cur.next) return cur
  let next = cur.next
  cur.next = pre
   reverseList(next, cur )

  return
};

// 正确的递归
var reverseList = function (head) {
  if (!head || !head.next) return head;
  let next = head.next; // next节点，反转后是最后一个节点
  let reverseHead = reverseList(next);
  head.next = null; // 裁减 head
  next.next = head; // 尾接
  return reverseHead;
};
