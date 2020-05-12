# react 灵魂拷问

会不会总有一些可可爱的实习生，冷不丁地跑过来给你提个问题，欧尼酱，这个这个是为什么呢（没错我在做梦，已经在第五层的我们很难三言两语能把这些问题给还在第一层的妹子讲清晰透彻，让她瞬间 get 到，许许多多简单的问题看似答案简单明了，但不断深挖中我们会发现更多自己遗忘基于 cv 开发没有意识到的点，无限套娃地提问中发现自己的无知和弱小。今天让我们由浅入深来对 react 本身常见问题进行剖析，看能不能给你一些启发。

## 为什么要引入 React?

讲这个我们就要先从源头讲起，我们先来思考俺们在 react 组件中写的 div 标签，是会原封不动直接 render 输出到真实 dom 上吗？好像也啥问题，难道还能变成其他标签不成？

这个时候又有个疑问，input 标签上其实是没有 onChange 事件，如果直接输出该事件为什么会生效呢？

嘻嘻倒是不会变成其他标签，但是我们在 JSX 中写的标签其实是被转化成一个个 reactElement 对象元素，上面配置的属性会被存储 props 中进行处理，onChange 是 react 提供给我们的合成事件。Actually 我们写的 jsx 中写的

```
const title = <h1 className="title">intopiece</h1>
```

会被 babel 转化为

```
const title = React.createElement(
    'h1',
    { className: 'title' },
    'intopiece'
);
```

本质上讲，JSX 只是为 React.createElement(component, props, ...children) 函数提供的语法糖，所以自然是需要引入 React。

ps：听说 babel 7.9 支持自动导入 jsx 了，以后就不用引入了。

## 为什么 constructor 里要调用 super 和传递 props

这个其实是 es6 Class 的语法，熟读阮一峰大神的 ECMAScript 6 入门应该了然于心，在 Class 的继承章节中：

> 子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象。

再来是我们的 component 不就是继承 React.Component，继承了父类提供给我们的生命周期和 render 等方法。

ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

如果子类没有定义 constructor 方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有 constructor 方法。

```
class ColorPoint extends Point {
}
// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

所以正常情况下我们可以省略 constructor 方法的书写。

但有些扑朔迷离的是，即便你调用 super() 的时候没有传入 props，你依然能够在 render 函数或其他方法中访问到 this.props。（如果你质疑这个机制，尝试一下即可）

那么这是怎么做到的呢？事实证明，React 在调用构造函数后也立即将 props 赋值到了实例上：

```
  // React 内部
  const instance = new YourComponent(props);
  instance.props = props;
```

因此即便你忘记了将 props 传给 super()，React 也仍然会在之后将它定义到实例上。

## setState 什么时候异步什么时候同步？

官网做了一番解释：

<!-- [链接](https://react.docschina.org/docs/react-component.html#setstate) -->

> 将 setState() 视为请求而不是立即更新组件的命令。为了更好的感知性能，React 会延迟调用它，然后通过一次传递更新多个组件。React 并不会保证 state 的变更会立即生效。

在我的走进 react fiber 中详细解释了，其实一次 setState 就是一次生成一次 update，连续多次 setState 会被放到 UpdateQueue 中，等待调度一起执行后 render 以达成 batchUpdate。

而且现在 fiber 的架构中核心是对不同的任务进行优先级调度，react 会根据更新任务所分配的 priorityLevel 计算出其对应的 expirationTime 过期时间，优先执行如用户输入等优先级较高的任务。

ps：setState 在原生事件，setTimeout，setInterval，Promise 等异步操作中，state 会同步更新。

## 为什么要使用 key , 有什么好处?

先来说一下背景：从数据结构上看，diff 的过程是需要对我们新旧两棵虚拟 dom 树进行对比找出差异来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。，即使在最前沿的算法中，该算法的复杂程度为 O(n 3 )，其中 n 是树中元素的数量：传统 Diff 算法需要找到两个树的最小更新方式，所以需要[两两]对比每个叶子节点是否相同，对比就需要 O(n^2)次了，再加上更新（移动、创建、删除）时需要遍历一次，所以是 O(n^3)。

而 React 的 Diff 算法则不同，简单粗暴（我喜欢

```
Prev                  Last
          A                     A
         / \                   / \
        /   \                 /   \
       B     D     ====>     D     B
      /                             \
     C                               C

# 按叶子节点位置比较
[0,0]     :     PA->LA   # 相同，不理会
[0.0, 0.0]:     PB->LD   # 不同，删除PB，添加LD
[0.1, 0.1]:     PD->LB   # 不同，更新
[0.1.0, 0.1.0]: PC->Null # Last树没有该节点，所以删除PC即可
[0.1.2, 0.1.2]: Null->LC # Prev树没有该节点，所以添加C到该位置
```

标准的 O(n)，所有的节点只遍历一次，只会对同层级的节点进行对比。

背景介绍完了，问题出现在当 react diff 过程中碰到循环输出的元素时会有一些问题。照旧举个栗子：

```
// 旧v-dom
<ul>
  <li>first</li>
  <li>second</li>
</ul>
// 新v-dom
<ul>
  <li>zero</li>
  <li>first</li>
  <li>second</li>
</ul>
```

这个时候 react 会判断原来对应位置的两个 li 和新的 li 不同，就会对其修改，并向真实 dom 树中插入新的 second 节点，而无法复用，消耗了不必要的性能。

[react 官网](https://reactjs.org/docs/reconciliation.html#keys)提出了设置 key 属性可以解决上述问题，当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。通过 key 作为同层级节点的唯一标识，可以让 react diff 时明确感知对应节点的变化，增加 diff 的准确性和对比速度。

```
// 旧v-dom
<ul>
  <li key="1">first</li>
  <li key="2">second</li>
</ul>
// 新v-dom
<ul>
  <li key="zero">zero</li>
  <li key="first">first</li>
  <li key="second">second</li>
</ul>
```

现在 React 就知道了，新增了 key 为"0"的元素，而"1"与"2"仅仅移动了位置。

但当我们遍历子节点的时候尽量**不要用 index 来做 key**，这是因为 index 不能够作为节点的唯一的标识，举个栗子：若当数组中第二第三项进行交换，这个时候尽管第二项已经是第三项的数据但 index 仍然为 1，diff 就无法通过 index 这个唯一标识来判断同级子元素是否发生变更。

```
// index作为key时，key没有发生变化导致diff无法感知变化
// 旧v-dom
<ul>
  <li key="0">zero</li>
  <li key="1">first</li>
  <li key="2">second</li>
</ul>
// 新v-dom
<ul>
  <li key="0">zero</li>
  <li key="1">second</li>
  <li key="2">first</li>
</ul>
```

ps：当我们讲 key 设为 math.random 随机数的时候，diff 会判断出节点标识变化导致每次 render 会直接对该节点进行 replace，这是一个强行刷新的方法，不过建议慎用。

## 入门：为啥需要 bind(this)

答：function 的 this 是在运行时的作用域决定的，默认的 this 会自动指向本身的实例，但无论是在 onclick 或者函数中调用自身方法，执行时已经无法保证是当前作用域（即 this 的指向是指向本身实例），所以无法拿到绑定在实例 prototype 上的对应方法。

这个可以了解一下 react 的合成事件系统，input 本身是没有 onchange，onchang 会被编译为 reactElement 的 props 中的一个属性，最后所有的回调事件都会被绑定到 document 节点上达成事件委托以提高性能，这个时候其实已经丢失了原有的 this 环境。

在 constructor 中进行绑定 this，能让该方法的 this 指向在实例化后始终指向自身实例。

### 拓展：bind(this)的类方法和箭头函数的区别

```
class App extends Component {
  a() {
    console.log(1)
  }

  a = () => {
    console.log(1)
  }
}
```

第一个就不用多说了，是原型方法的定义。
对应 ES5 就是

```
App.prototype.a = function() {}
```

第二个是 Stage 2 Public Class Fields 里面的写法，相当于

```
class App extends Component {
  constructor (...args) {
    super(...args)
    this.a = () => {
        console.log(1)
    }
  }
}
```

箭头函数的特性是在定义的时候确定 this 指向，而不是运行时。箭头函数与其他正常类函数不同，实例化时是在 constructor 中作为类的属性被赋值的。es6 类现在已经不用 babel 就可以写箭头函数了.

## 为什么要有自己一套事件机制

当我们在组件上设置事件处理器时，React 并不会在该 DOM 元素上直接绑定事件处理器. React 内部自定义了一套事件系统，在这个系统上统一进行事件订阅和分发.

具体来讲，React 利用事件委托机制在 Document 上统一监听 DOM 事件，再根据触发的 target 将事件分发到具体的组件实例。另外上面 e 是一个合成事件对象(SyntheticEvent), 而不是原始的 DOM 事件对象。

首先我们都知道 react 号称 write once, run everything，那么像 input 中输入事件在不同的环境如浏览器，原生等表现和控制都是不一样的，而 react 可以提供一个统一的 onChange 合成事件，通过对不同环境作以区分来控制表现的一致性。

- 抹平浏览器之间的兼容性差异
- 抽象跨平台事件机制
- 自定义一些高等级的事件

其次，我们 react fiber 重中之重是对不同的任务进行优先级调度，而对不同的事件进行优先级的定义和判断是一个前提，自己的事件机制也可以帮助我们 react 调度系统更好地进行不同优先级任务区分是悬停等待还是执行，以达成更优秀的用户体验。

## 虚拟 dom 和手动操作 dom 性能到底谁比较好？

https://www.zhihu.com/question/31809713/answer/53544875
https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484104&idx=1&sn=59f4d94f95664b2dbb9b23a6cd0bce45&scene=21#wechat_redirect

以往框架一旦发现数据发生了变动就对整个页面进行更新。这样的做法效率低下，因为数据的变动而导致的页面变动很可能只是局部的，直接对整个页面进行更新造成了不必要的性能消耗。

相比直接手动操作虚拟 dom，虚拟 dom 其实多了一个 diff 的过程，

在 react 16 后 react 分为 reconciler 协调阶段和 renderer 阶段两个阶段，协调阶段便负责构建虚拟 dom 树，在发生数据更新时两个虚拟 DOM 做合并操作（diff），得到更新的操作集(patch)，基于新旧两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步，计算树哪些部分需要更新。

我个人觉得虚拟 dom 最大的优势不是性能，而是大大的解放了我们前端的生产力，通过数据驱动告诉 react 这个状态如何控制对应的视图，只要更改对应状态便能实现视图的更新，我们完全脱离了以往需要手动调取浏览器提供 ap 进行 dom 节点更改的 jq 时代，并且本身是一个脱离开发环境桎梏的高级抽象，可以根据不同的宿主生成不同的宿主实例，根据对应的渲染器如 React DOM、React Native 达成跨平台的开发效果。

## 如何进行 react 性能优化

一. 分析问题

- chorme 的 performance
- React Profiler 进行分析

> React Profiler 是 React 提供的，分析组件渲染次数、开始时间及耗时的一个 API。记录的只是 commit 阶段的数据。

二. 解决方案

- 函数组件的 memo
- 类组件的 purecomponent 和 shouldComponentUpdate + 不可变库 immer
- 缓存：hooks 的 useCallback 和 useMemo
- 代码分割：lazy 和 suspense=》code split
- 减少副作用 + render 中的事件回调应调用函数引用。
- 使用 React.Fragment 避免添加额外的 DOM
- 谨慎使用 Context
- ssr： Next.js

ps: next 同构过程原理：

1. node server 接收客户端请求，得到当前的 req url path,然后在已有的路由表内查找到对应的组件，拿到需要请求的数据，将数据作为 props、context 或者 store 形式传入组件。
2. 然后基于 react 内置的服务端渲染 api renderToString() or renderToNodeStream() 把组件渲染为 html 字符串或者 stream 流。
3. 将数据注入到浏览器端(注水)
4. 服务器在把最终的 html 进行输出。
5. server 输出(response)后浏览器端可以得到数据(脱水)，浏览器开始进行渲染和节点对比，然后执行组件的 componentDidMount 完成组件内事件绑定和一些交互
6. 浏览器重用了服务端输出的 html 节点，整个流程结束。

## diff 完成后如何合并两个虚拟 dom 树的差异之处？

答：在 diff 的过程中，会同时存在两棵 fiber tree，当前的 current tree 和新生成的 workInProgress tree（简称 WIP。当 React 经过当前树时，对于每一个先存在的 fiber 节点，它都会创建一个替代（alternate）节点，这些节点组成了 WIP 树。这个节点是使用 render 方法返回的 React 元素的数据创建的。一旦更新处理完以及所有相关工作完成，React 就有一颗替代树来准备刷新屏幕。一旦这颗 WIP 树渲染（render）在屏幕上，它便成了当前树。

```
function createWorkInProgress(current, ...) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(...);
  }
  ...
  workInProgress.alternate = current;
  current.alternate = workInProgress;
  ...
  return workInProgress;
}
```
