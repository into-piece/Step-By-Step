# react灵魂拷问
## 为什么要引入 React?
讲这个我们就要先从源头讲起，我们先来思考俺们在react组件中写的div标签，是会原封直接render输出到真实dom上吗？好像也啥问题，难道还能变成其他标签不成？

这个时候又有个疑问，input标签上其实是没有onChange事件，如果直接输出事件为什么会生效呢？

嘻嘻倒是不会变成其他标签，但是我们写的标签其实是被转化成一个个reactElement对象元素，上面配置的属性会被存储props中进行处理，onchange是react提供给我们的合成事件。Actually我们写的jsx中写的
```
const title = <h1 className="title">intopiece</h1>
```
会被babel转化为
```
const title = React.createElement(
    'h1',
    { className: 'title' },
    'intopiece'
);
```

因为从本质上讲，JSX 只是为 React.createElement(component, props, ...children) 函数提供的语法糖。听说babel 7.9支持自动导入 jsx 了，以后就不用引入了。

## 为什么 constructor 里要调用 super 和传递 props
这个其实是es6 Class的语法，熟读阮一峰大神的ECMAScript 6 入门应该了然于心，在Class的继承章节中：

> 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

再来是我们的component不就是继承React.Component，继承了父类提供给我们的生命周期和render等方法。

ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。

如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有constructor方法。
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
所以正常情况下我们可以省略constructor方法的书写。

但有些扑朔迷离的是，即便你调用 super() 的时候没有传入 props，你依然能够在 render 函数或其他方法中访问到 this.props。（如果你质疑这个机制，尝试一下即可）

那么这是怎么做到的呢？事实证明，React 在调用构造函数后也立即将 props 赋值到了实例上：
```
  // React 内部
  const instance = new YourComponent(props);
  instance.props = props;
```
因此即便你忘记了将 props 传给 super()，React 也仍然会在之后将它定义到实例上。

## setState什么时候异步什么时候同步？  
官网做了一番解释：[链接](https://react.docschina.org/docs/react-component.html#setstate)
> 将 setState() 视为请求而不是立即更新组件的命令。为了更好的感知性能，React 会延迟调用它，然后通过一次传递更新多个组件。React 并不会保证 state 的变更会立即生效。

在我的走进react fiber中详细解释了，其实一次setState就是一次生成一次update，连续多次setState会被放到UpdateQueue中，等待调度一起执行后render达成batchUpdate。

setState在原生事件，setTimeout，setInterval，Promise等异步操作中，state会同步更新。

## diff完成后如何合并两个虚拟dom树的差异之处？  
答：fiber树有两颗，当前的current和新生成的workinprogress，。当React经过当前树时，对于每一个先存在的fiber节点，它都会创建一个替代（alternate）节点，这些节点组成了workInProgress树。这个节点是使用render方法返回的React元素的数据创建的。一旦更新处理完以及所有相关工作完成，React就有一颗替代树来准备刷新屏幕。一旦这颗workInProgress树渲染（render）在屏幕上，它便成了当前树。  
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

## 入门：为啥需要bind(this)   
答：function的this是在运行时的作用域决定的，默认的this会自动指向本身的实例，但无论是在在onclick或者函数中调用自身方法，执行时已经无法保证是当前作用域（即this的指向是指向本身实例），所以无法拿到绑定在实例prototype上的对应方法。  

这个可以了解一下react的合成事件系统，input本身是没有onchange，onchang会被编译为reactElement的props中的一个属性，最后所有的回调事件都会被绑定到document节点上达成事件委托以提高性能，这个时候其实已经丢失了原有的this。

bind(this)：在constructor中进行绑定this，能让该方法的this指向在实例化后始终指向自身实例。
  
箭头函数：es6类现在已经不用babel就可以写箭头函数了，箭头函数与不同函数不同，实例化时是在constructor作为类的属性被赋值，箭头函数的特性是在定义的时候确定this指向。

## 为什么要有自己一套事件机制
当我们在组件上设置事件处理器时，React并不会在该DOM元素上直接绑定事件处理器. React内部自定义了一套事件系统，在这个系统上统一进行事件订阅和分发.

具体来讲，React利用事件委托机制在Document上统一监听DOM事件，再根据触发的target将事件分发到具体的组件实例。另外上面e是一个合成事件对象(SyntheticEvent), 而不是原始的DOM事件对象。

首先我们都知道react号称write once, run everything，那么像input中输入事件在不同的环境如浏览器，原生等表现和控制都是不一样的，而react可以提供一个统一的onChange合成事件，通过对不同环境作以区分来控制表现的一致性。
- 抹平浏览器之间的兼容性差异
- 抽象跨平台事件机制
- 自定义一些高等级的事件

其次，我们react fiber重中之重是对不同的任务进行优先级调度，而对不同的事件进行优先级的定义和判断是一个前提，自己的事件机制也可以帮助我们react调度系统更好地进行不同优先级任务区分是悬停等待还是执行，以达成更优秀的用户体验。

## 虚拟dom和手动操作dom性能到底谁比较好？
https://www.zhihu.com/question/31809713/answer/53544875

以往框架一旦发现数据发生了变动就对整个页面进行更新。这样的做法效率低下，因为数据的变动而导致的页面变动很可能只是局部的，直接对整个页面进行更新造成了不必要的性能消耗。

相比直接手动操作虚拟dom，虚拟dom其实多了一个diff的过程，

在react 16后react分为reconciler协调阶段和renderer阶段两个阶段，协调阶段便负责构建虚拟dom树，在发生数据更新时两个虚拟DOM做合并操作（diff），得到更新的操作集(patch)，基于新旧两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步，计算树哪些部分需要更新。


我个人觉得虚拟dom最大的优势不是性能，而是大大的解放了我们前端的生产力，通过数据驱动告诉react这个状态如何控制对应的视图，只要更改对应状态便能实现视图的更新，我们完全脱离了以往需要手动调取浏览器提供ap进行dom节点更改的jq时代，并且本身是一个脱离开发环境桎梏的高级抽象，可以根据不同的宿主生成不同的宿主实例，根据对应的渲染器如React DOM、React Native达成跨平台的开发效果。

## 如何进行react性能优化
### 分析问题
#### chorme的performance 

#### React Profiler进行分析
> React Profiler是 React 提供的，分析组件渲染次数、开始时间及耗时的一个 API。记录的只是 commit 阶段的数据。

### 解决方案
- 函数组件的memo
- 类组件的purecomponent和scp + immer
- hooks的useCallback和useMemo
- lazy和suspense=》code split 
- 减少副作用 + render中的事件回调应调用函数引用。
- 使用React.Fragment避免添加额外的DOM
- 谨慎使用 Context
- ssr： Next.js

>整体来说 react 服务端渲染原理不复杂，其中最核心的内容就是同构。
node server 接收客户端请求，得到当前的req url path,然后在已有的路由表内查找到对应的组件，拿到需要请求的数据，将数据作为 props
、context或者store 形式传入组件，然后基于 react 内置的服务端渲染api renderToString() or renderToNodeStream() 把组件渲染为 html字符串或者 stream 流, 在把最终的 html 进行输出前需要将数据注入到浏览器端(注水)，server 输出(response)后浏览器端可以得到数据(脱水)，浏览器开始进行渲染和节点对比，然后执行组件的componentDidMount 完成组件内事件绑定和一些交互，浏览器重用了服务端输出的 html 节点，整个流程结束。