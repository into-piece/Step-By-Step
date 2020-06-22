# 20200506 面试总结

### call apply 作用和区别

- 作用： 让方法可以调用对象 this 属性上的方法或属性
- 区别：接受参数不一样，call 接受第一个参数为对象，后面为执行函数的参数，但 apply 为数组形式。

### 说说快速排序

通过把数组中数字与最后一个数字对比分为三部分，左右部分再递归进行大小对比进行排序。

### 实现随机颜色值

## json.stringify 需要注意什么

undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如 JSON.stringify(function(){}) or JSON.stringify(undefined)。

## tcp udp 的区别

- TCP 是面向连接的，UDP 是面向无连接的
- TCP 是面向字节流的，UDP 是基于数据报的
- TCP 保证数据正确性，UDP 可能丢包
- UDP 程序结构较简单，只有端口号

### 应用场景：

udp：需要处理速度快，可以容忍丢包，如直播，实时游戏之类的

### TCP 为什么是可靠连接

- 通过 TCP 连接传输的数据无差错，不丢失，不重复，且按顺序到达。
- TCP 报文头里面的序号能使 TCP 的数据按序到达
- 报文头里面的确认序号能保证不丢包，累计确认及超时重传机制
- TCP 拥有流量控制及拥塞控制的机制

## 数组去重

- Set 对象的特性=》new set([1,2,2,3])
- 新建一个空的结果数组，for 循环原数组，判断结果数组是否存在当前元素，如果有相同的值则跳过，不相同则 push 进数组。
- reduce+includes

```
function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}
```

## object 和 map 的区别

object 的 key 只能是字符串，map 的 key 可以是任何数据类型

> Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

你可以通过 size 属性很容易地得到一个 Map 的键值对个数，而对象的键值对个数只能手动确认。很多方法都非常方便，has 可以得知是否存在某个属性。

## [websocket(https://juejin.im/post/5a1bdf676fb9a045055dd99d)

HTTP 是不支持持久连接的，keep-alive 只是把多个连接合并为一个。websocket 是 h5 推出的一个是一个持久化协议，只要建立一次连接，就可以持续接收服务端发送的数据。

解决了 HTTP 轮询（得不到就一直请求）和 long poll（发送堵塞直到得到数据返回）同步有延迟，消耗资源（HTTP 是非状态性的，每次建立连接都是需要鉴别身份）

### 事件
```
//创建WebSocket实例，可以使用ws和wss。第二个参数可以选填自定义协议，如果多协议，可以以数组方式
var socket = new WebSocket('ws://demos.kaazing.com/echo');
``` 

- open
服务器相应WebSocket连接请求触发
```
  socket.onopen = (event) => {
  	socket.send('Hello Server!');
  };
```

- message
服务器有 响应数据 触发
```
  socket.onmessage = (event) => {
      debugger;
      console.log(event.data);
  };
复
```
- error
出错时触发，并且会关闭连接。这时可以根据错误信息进行按需处理
```
  socket.onerror = (event) => {
  	console.log('error');
  }
复
```
- close
```
 连接关闭时触发，这在两端都可以关闭。另外如果连接失败也是会触发的。
 针对关闭一般我们会做一些异常处理,关于异常参数：

 1. socket.readyState  2 正在关闭  3 已经关闭
 2. event.wasClean [Boolean]  true  客户端或者服务器端调用close主动关闭  false 反之
 3. event.code [Number] 关闭连接的状态码。socket.close(code, reason)
 4. event.reason [String] 关闭连接的原因。socket.close(code, reason)
 socket.onclose = (event) => {
  debugger;
 }
```



### HTTP/2 和 Websocket
#### HTTP/2

- 它是 google 提出的开源协议，旨在提高网络传输效率
- 它是二进制协议
- 它采用多路复用解决 HTTP 1.1 的 head-of-line blocking (HOL Blocking)问题(较慢的请求阻塞其它请求的问题)
- 它通过压缩 http 头提高效率
- 它支持全双工，因此可以使用 Server Push 推送到客户端

### 对比
- HTTP/2 Server Push 不能被代码使用，所以还得配合SSE(Server sent event)，无论从coder还是运维的角度来看，这混搭增加了复杂度。
- IE对http2以及SSE都支持的不好
- HTTP/2 连接不确定性会永远保持连接，而websocket有onclose事件，对代码友好

## 基本数据类型有哪些

string number boolean null undefined object symbol bigint

## new 一个对象的过程

new 运算接受一个构造器和一组调用参数，实际上做了几件事：

- 创建一个继承构造器的原型对象的新对象作为实例；
- 将 this 和调用参数传给构造器，执行；
- 判断执行返回结果是否为对象，若是则返回，否则返回创建的实例对象

## promise 原理 ，then 实现

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

## eventloop 机制介绍

## async wait 机制

## bfc 块级格式上下文

格式上下文是定义根据文档树元素生成的盒子所处的环境的规则，盒子按照什么规则展示。

块击作用域有自己一些展示规则，包括：

## 缓存和强缓存

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

给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素

```
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
```

## 作用域，闭包

作用域是存储和访问变量的一套规则，包含全局作用域，函数作用域，块级作用域。

闭包：可以记住和访问自身词法作用域，函数在当前作用域之外执行，就产生了闭包。

有权访问其他函数作用域中的变量的函数

因为存在函数 a 作用域中变量的引用，所以即使函数 a 执行完毕也无法被垃圾回收

## 执行上下文

当 JS 引擎解析到可执行代码片段（通常是函数调用阶段）的时候，就会先做一些执行前的准备工作，这个 “准备工作”，就叫做 "执行上下文(execution context 简称 EC)" 或者也可以叫做执行环境。

执行上下文 为我们的可执行代码块提供了执行前的必要准备工作，例如变量对象的定义、作用域链的扩展、提供调用者的对象引用等信息。

分为

- 全局执行上下文
- 函数执行上下文
- Eval 函数执行上下文

内容：

- 变量对象
- 活动对象
- 作用域链
- 调用者信息

## let var 区别，let 为什么能实现块儿作用域

babel 会将 let 解析为立即执行函数，归根到底是生成一个函数作用域保存私有变量

## js 处理代码的过程

js 编译过程

1. 词法分析（这个过程会讲由字符组成的祖父穿分解成有意义的代码块。这些代码块叫词法单元。
2. 语法分析 将词法单元流转成一个由元素逐级嵌套所组成的代表了程序语法结构的树，生成抽象语法树
3. 代码生成 将 AST 转换成可执行代码

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
- interface可以声明合并（多次声明， type不行

[react diff](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484536&idx=1&sn=94777b8c1aab80dffe1fc224bec02c72&scene=21#wechat_redirect)

## tcp 握手

客户端发送请求报文（SYN=1，seq=x）进入 SYN-SENT 状态（表示请求连接
服务端接受并发送确认报文（SYN=1,ACK,ack=x+1,seq=y）进入 SYN-RCVD 状态
客户端发送确认报文（ACK=1,ack= y+1,seq=x+1)进入 ESTABLISHED 状态 （建立连接。表示两台机器正在通信。

## 挥手

客户端发送 FIN 报文（FIN=1,seq=x)，进入 FIN_WAIT 1
服务端接受发送确认报文（ACK=1,ack=x+1，seq=y）服务端进入 CLOSE_WAIT 浏览器接受进入 FIN_WAIT 2
服务端等待所有报文发送完毕，再次发送报文（FIN=1,ACK=1,ack=x+1，seq=y)进入 LAST_ACK
客户端接收到发送（ACK=1,seq=z,ack=y+1）进入 TIME_WAIT 状态，等待 2msl 再关闭 close（在这段时间内如果客户端没有收到服务端的重发请求，那么表示 ACK 成功到达，挥手结束，否则客户端重发 ACK。这样可让 TCP 再次发送最后的 ACK 以防这个 ACK 丢失（另一端超时并重发最后的 FIN）。
服务端接收到 关闭 tcp 连接

## vue 双向绑定

vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

首先要实现一个 oberserve，Object.defineProperty()需要对对象的每个 key 包括子对象的 key 进行遍历再设置 setter 和 getter，proxy 就不需要。

然后在 complie 解析模版的时候通过识别特定指令，添加监听数据的订阅者，绑定更新函数，收集数据与视图的依赖关系，在数据变更的时候进行相应的回调和

## webpack 打包原理

1. 利用 babel 完成代码转换及解析,并生成单个文件的依赖模块 Map
2. 从入口开始递归分析，并生成整个项目的依赖图谱
3. 将各个引用模块打包为一个立即执行函数
4. 将最终的 bundle 文件写入 bundle.js 中

我们会可以使用这几个包：

- @babel/parser：负责将代码解析为抽象语法树
- @babel/traverse：遍历抽象语法树的工具，我们可以在语法树中解析特定的节点，然后做一些操作，如 ImportDeclaration 获取通过 import 引入的模块,FunctionDeclaration 获取函数
- @babel/core：代码转换，如 ES6 的代码转为 ES5 的模式

### 使用 babel 解析转化入口文件，获取 AST

我们这里使用@babel/parser,这是 babel7 的工具,来帮助我们分析内部的语法,包括 es6,返回一个 AST 抽象语法树。

### 使用 babel/traverse 处理 AST，找出所有依赖模块

Babel 提供了@babel/traverse(遍历)方法维护这 AST 树的整体状态,我们这里使用它来帮我们找出依赖模块。

### 将 AST 语法树转换为浏览器可执行代码

将 AST 语法树转换为浏览器可执行代码,我们这里使用@babel/core 和 @babel/preset-env。

### 递归解析所有依赖项,生成依赖关系图

判断有依赖对象,递归解析所有依赖项，生成依赖关系图

### 重写 require 函数,输出 bundle =》立即执行函数

需要注意：

- 我们写模块的时候，用的是 import/export.经转换后,变成了 require/exports
- 我们要让 require/exports 能正常运行，那么我们得定义这两个东西，并加到 bundle.js 里
- 在依赖图谱里，代码都成了字符串。要执行，可以使用 eval

因此，我们要做这些工作：

- 定义一个 require 函数，require 函数的本质是执行一个模块的代码，然后将相应变量挂载到 exports 对象上
- 获取整个项目的依赖图谱，从入口开始，调用 require 方法。 完整代码如下：

### 输出立即执行函数

### 参考

[webpack 打包原理 ? 看完这篇你就懂了 !](https://juejin.im/post/5e116fce6fb9a047ea7472a6#heading-12)
[Webpack4 打包机制原理简析](https://juejin.im/post/5de099886fb9a071562facad#heading-3)

## 热更新底层逻辑

每次修改代码，紧接着触发重新编译，然后浏览器就会发出 2 次请求，依次是返回 hash 和修改文件名，第二次请求是修改的文件内容。

思考下 🤔，浏览器是如何知道本地代码重新编译了，并迅速请求了新生成的文件？是谁告知了浏览器？浏览器获得这些文件又是如何热更新成功的？那让我们带着疑问看下热更新的过程，从源码的角度看原理。

### 1.webpack-dev-server 启动本地服务

- 启动 webpack，生成 compiler 实例。compiler 上有很多方法，比如可以启动 webpack 所有编译工作，以及监听本地文件的变化。
- 用 express 启动本地服务器，启动 websocket 服务，实现双向通信，服务器就可以通知浏览器需要发生热更新，请求新的资源。
- webpack-dev-middleware 调用 compiler 监听代码变化，变化则自动编译重新打包，生成新的 hash。
- 浏览器通过 websocket 接收到热更新的通知，请求并获取修改内容。
- hotApply 热更新模块替换，将新的模块添加到 modules 中并执行

Hash：编译标示。热更新浏览器请求，会返回下次编译的 hash。

### 核心

Webpack Watch：在项目启动之后，Webpack 会通过 Compiler 类的 Run 方法开启编译构建过程，编译完成后，调用 Watch 方法监听文件变更，当文件发生变化，重新编译，编译完成之后继续监听。

> 通过 websocket 建立起 浏览器端 和 服务器端 之间的通信

hash 值代表依次编译标示，客户端判断是否发送请求。

## 如何提升 webpack 的打包速度

### exclude/include

### cache-loader

在一些性能开销较大的 loader 之前添加 cache-loader，将结果缓存中磁盘中

### DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles

https://www.webpackjs.com/plugins/dll-plugin/
这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的。

在打包的过程中将，常用的包进行提前打包，节省之后打包的时间。

### webpack-parallel-uglify-plugin 和 happyPack

由于有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack 构建慢的问题会显得严重。文件读写和计算操作是无法避免的，那能不能让 Webpack 同一时刻处理多个任务，发挥多核 CPU 电脑的威力，以提升构建速度呢？

HappyPack 就能让 Webpack 做到这点，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。

### 参考

[从零实现 webpack 热更新 HMR](https://juejin.im/post/5df36ffd518825124d6c1765#heading-15)
[轻松理解 webpack 热更新原理](https://juejin.im/post/5de0cfe46fb9a071665d3df0#heading-6)
[Webpack 4进阶--从前的日色变得慢 ，一下午只够打一次包](https://juejin.im/post/5ac9b7165188255cb32e66cc#heading-4)

## [跨域](https://juejin.im/post/5e6c58b06fb9a07ce01a4199)

1.  cors=> response.setHeader("Access-Control-Allow-Origin", \*)
2.  jsonp js 生成 script 标签 运用 src 引用资源不跨域的 同时需要带一个 callback 参数，服务端通过识别 callback 运行，将所需要的数据放入 callback 的参数中 （只能是 get 方法
3.  iframe
4.  postMessage HTML5 api  
    a.） 页面和其打开的新窗口的数据传递  
    b.） 多窗口之间消息传递  
    c.） 页面与嵌套的 iframe 消息传递  
    d.） 上面三个场景的跨域数据传递
5.  nginx 代理跨域 ： 同源策略是浏览器的安全策略，不是 HTTP 协议的一部分。服务器端调用 HTTP 接口只是使用 HTTP 协议，不会执行 JS 脚本，不需要同源策略，也就不存在跨越问题。
6.  WebSocket 协议跨域 HTML5 协议 实现了浏览器与服务器全双工通信，同时允许跨域通讯，
7.  nodeJs 中间件代理 利用 node + express + http-proxy-middleware 搭建一个 proxy 服务器。

## GET 和 POST 到底有什么区别？

- 语义上：get 是从服务器上获取数据，post 是提交数据。
- 传输长度：get 参数有长度限制（受限于 url 长度，具体的数值取决于浏览器和服务器的限制，最长 2048 字节），而 post 无限制。
- 传输数据：get 请求数据放在请求 url 后，post 会放在请求体中。
- 保密性：get 请求的数据在 url 容易被窃取，会被浏览器主动缓存，get 请求会保存在浏览器历史记录中，还可能保存在 web 服务器的日志中，post 保密性相比好一点
- 幂等：get 请求多次返回结果是一样的，post 则可能多次更改服务器的数据。
- 数据类型：get 只允许 ascll 字符，而 post 则无限制，所以很多文件上都是 post 请求。
- GET 产生一个 TCP 数据包；POST 产生两个 TCP 数据包。（并不是所有浏览器都会在 POST 中发送两次包，Firefox 就只发送一次。

## koa 中间件机制，解决了什么问题
