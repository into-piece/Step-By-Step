# 20200506 面试总结

### call apply 作用和区别

- 作用： 让方法可以调用对象 this 属性上的方法或属性
- 区别：接受参数不一样，call 接受第一个参数为对象，后面为执行函数的参数，但 apply 为数组形式。

### 说说快速排序

通过把数组中数字与最后一个数字对比分为三部分，左右部分再递归进行大小对比进行排序。

### 实现随机颜色值

### 如何提升 webpack 的打包速度

#### DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles

https://www.webpackjs.com/plugins/dll-plugin/
这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的。

在打包的过程中将，常用的包进行提前打包，节省之后打包的时间。

### json.stringify 需要注意什么

undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如 JSON.stringify(function(){}) or JSON.stringify(undefined)。

### tcp udp 的区别

- TCP 是面向连接的，UDP 是面向无连接的
- TCP 是面向字节流的，UDP 是基于数据报的
- TCP 保证数据正确性，UDP 可能丢包
- UDP 程序结构较简单，只有端口号

#### 应用场景：

udp：需要处理速度快，可以容忍丢包，如直播，实时游戏之类的

#### TCP 为什么是可靠连接

- 通过 TCP 连接传输的数据无差错，不丢失，不重复，且按顺序到达。
- TCP 报文头里面的序号能使 TCP 的数据按序到达
- 报文头里面的确认序号能保证不丢包，累计确认及超时重传机制
- TCP 拥有流量控制及拥塞控制的机制

### 数组去重

- Set 对象的特性=》new set([1,2,2,3])
- 新建一个空的结果数组，for 循环原数组，判断结果数组是否存在当前元素，如果有相同的值则跳过，不相同则 push 进数组。
- reduce+includes

```
function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}
```

### object 和 map 的区别

object 的 key 只能是字符串，map 的 key 可以是任何数据类型

> Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

你可以通过 size 属性很容易地得到一个 Map 的键值对个数，而对象的键值对个数只能手动确认。很多方法都非常方便，has 可以得知是否存在某个属性。

### 说说 websocket

HTTP 是不支持持久连接的，keep-alive 只是把多个连接合并为一个。websocket 是 h5 推出的一个是一个持久化协议，只要建立一次连接，就可以持续接收服务端发送的数据。

解决了 HTTP 轮询（得不到就一直请求）和 long poll（发送堵塞直到得到数据返回）同步有延迟，消耗资源（HTTP 是非状态性的，每次建立连接都是需要鉴别身份）

### 基本数据类型有哪些

string number boolean null undefined object symbol bigint

### new 一个对象的过程

new 运算接受一个构造器和一组调用参数，实际上做了几件事：

- 创建一个继承构造器的原型对象的新对象作为实例；
- 将 this 和调用参数传给构造器，执行；
- 判断执行返回结果是否为对象，若是则返回，否则返回创建的实例对象

### promise 原理 ，then 实现

在 promise 中用回调数组保存 then 传入的回调，等待异步执行完毕后，resolve 被调用执行 then 保存的对应的 fullfilled 回调或 reject 回调。

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

- 强缓存： expires（HTTP1.0）（时间戳） 和 cash-control（http1.1）（优先级更高）
- 协商缓存：last-modified（资源的最新更新时间）和 e-tag（资源唯一标示）

洗牌算法

### https 原理

> SSL 和 CA 数字证书结合

https 分为两个阶段，数字证书验证阶段和数据传输阶段。

- 首先服务器用 RSA 生成公钥和私钥
- 在数字证书验证阶段服务器把公钥放在证书里发送给客户端。
- 客户端向一个权威的服务器检查证书的合法性，如果证书合法就生成随机数并通过公钥进行加密。发送到服务端
- 服务端通过私钥进行解密，以此解密后的随机数作为数据传输阶段中对称加密的密钥，对后面传输的数据进行加密。

## express 和 koa 的区别，洋葱模型

Express 和 Koa 最明显的差别就是 Handler 的处理方法，一个是普通的回调函数，一个是利用生成器函数（Generator Function）来作为响应器。往里头儿说就是 Express 是在同一线程上完成当前进程的所有 HTTP 请求，而 Koa 利用 co 作为底层运行框架，利用 Generator 的特性，实现“协程响应”，异步处理能力大大增强。

koa 没有内置 router，view，给了社区很大的自由

## 如何实现一个画板，如何让画笔更流畅

## 如何实现扑克牌的反转效果

transform: rotate3D

使用 ajax 下载文件
如何实现富文本编辑器
node 的模块能在浏览器中执行吗？

react hook 的理解和应用

## node 多进程的通信方式

Node 进程间通信有 4 种方式：

- 通过 stdin/stdout 传递 json：最直接的方式，适用于能够拿到“子”进程 handle 的场景，适用于关联进程之间通信，无法跨机器

- Node 原生 IPC 支持：最 native（地道？）的方式，比上一种“正规”一些，具有同样的局限性

- 通过 sockets：最通用的方式，有良好的跨环境能力，但存在网络的性能损耗

- 借助 message queue：最强大的方式，既然要通信，场景还复杂，不妨扩展出一层消息中间件，漂亮地解决各种通信问题

## [taro 的原理](https://blog.csdn.net/sinat_17775997/article/details/103391294)

编译原理
![](https://i.bmp.ovh/imgs/2020/05/b6c0a6a016c99747.png)
[taro 解析](http://www.ayqy.net/blog/taro/)

node 服务如何处理错误和异常

## http1 和 http2 的区别

### HTTP/1.1 的缺陷

#### TCP 连接数限制

对于同一个域名，浏览器最多只能同时创建 6~8 个 TCP 连接 (不同浏览器不一样)。为了解决数量限制，出现了 域名分片 技术，其实就是资源分域，将资源放在不同域名下 (比如二级子域名下)，这样就可以针对不同域名创建连接并请求，以一种讨巧的方式突破限制，但是滥用此技术也会造成很多问题，比如每个 TCP 连接本身需要经过 DNS 查询、三步握手、慢启动等，还占用额外的 CPU 和内存，对于服务器来说过多连接也容易造成网络拥挤、交通阻塞等，对于移动端来说问题更明显

#### 队头阻塞

队头阻塞(Head-Of-Line Blocking),导致带宽无法被充分利用。队头阻塞是指当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。

解决方法：

- 减少请求资源的数量，资源合并。
- 将同一页面的资源分散到不同域名下，提升连接上限。Chrome 有个机制，同一个域名同时最多只能建立 6 个 TCP 连接，如果在同一个域名下同时有 10 个请求发生，那么其中 4 个请求会进入排队等待状态，直至进行中的请求完成。

#### 无状态特性--带来的巨大 HTTP 头部

由于报文 Header 一般会携带"User Agent""Cookie""Accept""Server"等许多固定的头字段（如下图），多达几百字节甚至上千字节，但 Body 却经常只有几十字节（比如 GET 请求、 204/301/304 响应），成了不折不扣的“大头儿子”。Header 里携带的内容过大，在一定程度上增加了传输的成本。更要命的是，成千上万的请求响应报文里有很多字段值都是重复的，非常浪费

### 明文传输--带来的不安全性

HTTP/1.1 在传输数据时，所有传输的内容都是明文，客户端和服务器端都无法验证对方的身份，这在一定程度上无法保证数据的安全性。

你有没有听说过"免费 WiFi 陷阱”之类的新闻呢？ 黑客就是利用了 HTTP 明文传输的缺点，在公共场所架设一个 WiFi 热点开始“钓鱼”，诱骗网民上网。一旦你连上了这个 WiFi 热点，所有的流量都会被截获保存，里面如果有银行卡号、网站密码等敏感信息的话那就危险了，黑客拿到了这些数据就可以冒充你为所欲为。

### HTTP/2 新特性

HTTP/2 传输数据量的大幅减少,主要有两个原因:以二进制方式传输和 Header 压缩。

#### 二进制传输

HTTP/2 采用二进制格式传输数据，而非 HTTP/1.x 里纯文本形式的报文 ，二进制协议解析起来更高效。 HTTP/2 将请求和响应数据分割为更小的帧，并且它们采用二进制编码。

它把 TCP 协议的部分特性挪到了应用层，把原来的"Header+Body"的消息"打散"为数个小片的二进制"帧"(Frame),用"HEADERS"帧存放头数据、"DATA"帧存放实体数据。HTTP/2 数据分帧后"Header+Body"的报文结构就完全消失了，协议看到的只是一个个的"碎片"。

#### Header 压缩

HTTP/2 并没有使用传统的压缩算法，而是开发了专门的"HPACK”算法，在客户端和服务器两端建立“字典”，用索引号表示重复的字符串，还采用哈夫曼编码来压缩整数和字符串，可以达到 50%~90%的高压缩率。

#### Server Push

HTTP2 还在一定程度上改变了传统的“请求-应答”工作模式，服务器不再是完全被动地响应请求，也可以新建“流”主动向客户端发送消息。比如，在浏览器刚请求 HTML 的时候就提前把可能会用到的 JS、CSS 文件发给客户端，减少等待的延迟，这被称为"服务器推送"（ Server Push，也叫 Cache push）。

- 客户端可以缓存推送的资源
- 客户端可以拒收推送过来的资源
- 推送资源可以由不同页面共享
- 服务器可以按照优先级推送资源

#### 多路复用

在 HTTP/2 中，有了二进制分帧之后，HTTP /2 不再依赖 TCP 链接去实现多流并行了，在 HTTP/2 中，

- 同域名下所有通信都在单个连接上完成。

- 单个连接可以承载任意数量的双向数据流。

- 数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装。

#### 请求优先级设置

HTTP/2 里的每个 stream 都可以设置依赖 (Dependency) 和权重，可以按依赖树分配优先级，解决了关键请求被阻塞的问题

#### 流量控制

每个 http2 流都拥有自己的公示的流量窗口，它可以限制另一端发送数据。对于每个流来说，两端都必须告诉对方自己还有足够的空间来处理新的数据，而在该窗口被扩大前，另一端只被允许发送这么多数据。

## 两数之和（数组内找出 2 个数的和值）

```

function findSum(arr: number[], target:number){
  arr.
}

```

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

## 理解堆栈溢出和内存泄漏的原理，如何防止

堆栈溢出：函数调用栈内存储的函数过多而形成溢出，一般是因为函数递归调或死循环。
内存泄漏：程序中己动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费。

- 一般出现在全局变量
- 被遗忘的计时器
- addEventListener
- 脱离 DOM 的引用
- 闭包

多用 WeakMap 和 weakSet

## [去重方法](https://segmentfault.com/a/1190000016418021)

## typescript 的 type 和 interface 的区别

- type 可以声明基本类型、联合类型和元组，interface 不行
- 继承 type 和 interface 不是互斥的，可以相互继承
- 声明函数方式不一样
- 实现：type 也可以 implements，但是不可以通过联合类型去实现类。
  你能定义多次相同的 interface，这些定义将要合并为一个。对于类型别名就不成立，因为类型别名是独一无二的实体。

[react diff](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484536&idx=1&sn=94777b8c1aab80dffe1fc224bec02c72&scene=21#wechat_redirect)
