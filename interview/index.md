# 20200506面试总结

### call apply 作用和区别
- 作用： 让方法可以调用对象this属性上的方法或属性 
- 区别：接受参数不一样，call接受第一个参数为对象，后面为执行函数的参数，但apply为数组形式。

### 说说快速排序
通过把数组中数字与最后一个数字对比分为三部分，左右部分再递归进行大小对比进行排序。

### 实现随机颜色值

### 如何提升 webpack 的打包速度


### json.stringify 需要注意什么
undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如JSON.stringify(function(){}) or JSON.stringify(undefined)。

### tcp udp 的区别
- TCP 是面向连接的，UDP 是面向无连接的
- TCP 是面向字节流的，UDP 是基于数据报的
- TCP 保证数据正确性，UDP 可能丢包
- UDP程序结构较简单，只有端口号

#### 应用场景：
udp：需要处理速度快，可以容忍丢包，如直播，实时游戏之类的

#### TCP 为什么是可靠连接
- 通过 TCP 连接传输的数据无差错，不丢失，不重复，且按顺序到达。
- TCP 报文头里面的序号能使 TCP 的数据按序到达
- 报文头里面的确认序号能保证不丢包，累计确认及超时重传机制
- TCP 拥有流量控制及拥塞控制的机制

### 数组去重
- Set对象的特性=》new set([1,2,2,3])
- 新建一个空的结果数组，for 循环原数组，判断结果数组是否存在当前元素，如果有相同的值则跳过，不相同则push进数组。
- reduce+includes
```
function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}
```

### object 和 map 的区别
object的key只能是字符串，map的key可以是任何数据类型

>Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

你可以通过size属性很容易地得到一个Map的键值对个数，而对象的键值对个数只能手动确认。很多方法都非常方便，has可以得知是否存在某个属性。

### 说说websocket
HTTP是不支持持久连接的，keep-alive只是把多个连接合并为一个。websocket是h5推出的一个是一个持久化协议，只要建立一次连接，就可以持续接收服务端发送的数据。

解决了HTTP轮询（得不到就一直请求）和long poll（发送堵塞直到得到数据返回）同步有延迟，消耗资源（HTTP是非状态性的，每次建立连接都是需要鉴别身份）

### 基本数据类型有哪些
string number boolean null undefined object symbol bigint

### new 一个对象的过程
new 运算接受一个构造器和一组调用参数，实际上做了几件事：
- 创建一个继承构造器的原型对象的新对象作为实例；
- 将 this 和调用参数传给构造器，执行；
- 判断执行返回结果是否为对象，若是则返回，否则返回创建的实例对象

### promise 原理 ，then 实现
在promise中用回调数组保存then传入的回调，等待异步执行完毕后，resolve被调用执行then保存的对应的fullfilled回调或reject回调。

```
then = (successfunc: Func, failfunc?: Func) => {
    return new Promise((resolve, reject) => {
      try {
        if (this.status === PENDING) {
          successfunc &&
            this.successCallbackList.push((v: any) => {
              setTimeout(() => successfunc(v));
            });
          failfunc &&
            this.failCallbackList.push((v: any) => {
              setTimeout(() => failfunc(v));
            });
        }

        // 第二次第三次then的时候 状态已经改完成功或者失败
        if (this.status === PENDING) {
          const res = successfunc(this.value);
          resolve(res);
        }

        if (this.status === REJECTED) {
          const res = failfunc && failfunc(this.value);
          resolve(res);
        }
      } catch (e) {
        reject(e);
      }
    });
  };
```

### eventloop 机制介绍

### async wait 机制

### bfc 块级格式上下文

### 缓存和强缓存
- 强缓存： expires（HTTP1.0）（时间戳） 和cash-control（http1.1）（优先级更高）
- 协商缓存：last-modified（资源的最新更新时间）和e-tag（资源唯一标示）

洗牌算法

### https 原理
> SSL和CA数字证书结合

https分为两个阶段，数字证书验证阶段和数据传输阶段。
- 首先服务器用RSA生成公钥和私钥
- 在数字证书验证阶段服务器把公钥放在证书里发送给客户端。
- 客户端向一个权威的服务器检查证书的合法性，如果证书合法就生成随机数并通过公钥进行加密。发送到服务端
- 服务端通过私钥进行解密，以此解密后的随机数作为数据传输阶段中对称加密的密钥，对后面传输的数据进行加密。


express 和 koa 的区别，洋葱模型
Express 和 Koa 最明显的差别就是 Handler 的处理方法，一个是普通的回调函数，一个是利用生成器函数（Generator Function）来作为响应器。往里头儿说就是 Express 是在同一线程上完成当前进程的所有 HTTP 请求，而 Koa 利用 co 作为底层运行框架，利用 Generator 的特性，实现“协程响应”，异步处理能力大大增强。

koa 没有内置router，view，给了社区很大的自由



如何实现一个画板，如何让画笔更流畅
如何实现扑克牌的反转效果
使用ajax下载文件
如何实现富文本编辑器
node 的模块能在浏览器中执行吗？


react hook 的理解和应用
## node 多进程的通信方式
Node进程间通信有4种方式：

- 通过stdin/stdout传递json：最直接的方式，适用于能够拿到“子”进程handle的场景，适用于关联进程之间通信，无法跨机器

- Node原生IPC支持：最native（地道？）的方式，比上一种“正规”一些，具有同样的局限性

- 通过sockets：最通用的方式，有良好的跨环境能力，但存在网络的性能损耗

- 借助message queue：最强大的方式，既然要通信，场景还复杂，不妨扩展出一层消息中间件，漂亮地解决各种通信问题


## [taro的原理](https://blog.csdn.net/sinat_17775997/article/details/103391294)
编译原理
![](https://i.bmp.ovh/imgs/2020/05/b6c0a6a016c99747.png)


node 服务如何处理错误和异常
http1 和 http2 的区别
两数之和（数组内找出2个数的和值）


作用域，闭包
let var 区别，let 为什么能实现块儿作用域
js 处理代码的过程
react 生命周期执行过程 ，包括子组件
react setState 过
fiber 机制
diff 算法
http 请求过程
缓存机制的处理过程
vue 和 react 区别，
koa 中间件机制，解决了什么问题
