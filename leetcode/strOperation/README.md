> 接下来我们来看一道综合性比较强的字符串大题：

> 真题描述： 设计一个支持以下两种操作的数据结构：
> void addWord(word)
> bool search(word)
> search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。
> . 可以表示任何一个字母。

> 示例: addWord("bad")
> addWord("dad")
> addWord("mad")
> search("pad") -> false
> search("bad") -> true
> search(".ad") -> true
> search("b..") -> true
> 说明:
> 你可以假设所有单词都是由小写字母 a-z 组成的。

```
class WordDictionary {
  words = new Map()

  addWord(v){
    const len = v.length
    // 这里有个技巧，把字符的长度作为key，相同长度的字符保存进同一个数组中 虽然我也不是很懂为啥
    if(this.words.has(len)){
      const value = this.words.get(len).push(v)
      this.words.set(len,value)
    }else{
      this.words.set(len,[v])
    }
  }

  search(v){
    const len = v.length
    if(!this.word.has(len)) return false
    const wordArr = this.word.get(len)

    // 若不存在。 则简单地判断是否包含对应的target值
    if (!word.includes('.')) {
      // 定位到和目标字符串长度一致的字符串数组，在其中查找是否存在该字符串
      return wordArr.includes(v)
    }

    // 否则是正则表达式，要先创建正则表达式对象
    const reg = new RegExp(word)

    // 只要数组中有一个匹配正则表达式的字符串，就返回true
    return this.words[len].some((item) => {
      return reg.test(item)
    })
  }

}
```
