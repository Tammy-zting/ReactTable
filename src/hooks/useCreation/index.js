import { useRef } from 'react';
import useUpdate from '../useUpdate'
import usePersistFn from '../usePersistFn'

export default function useCreation(factory, deps) {
  //useRef除了获取dom节点的功能外，useRef的current属性，可以方便保存任何可变值。useRef每一次渲染时，都会返回同一个ref对象。
  const ref = useRef({
    deps,
    obj: undefined,
    initialized: false,
  });

  if (!ref) {
    throw new Error('存在内存泄漏！重新渲染时无法创建useRef.');
  }
  if (ref.current.initialized === false || !depsAreSame(ref.current.deps, deps)) {
    //只有第1次或依赖被动时才会 执行factory实例化函数，【多次执行始终是同一个实例化的对象】
    ref.current.deps = deps;
    if (typeof factory === 'function') {
      ref.current.obj = factory(); //实例化函数返回的对象
    } else {
      ref.current.obj = factory;
    }
    ref.current.initialized = true;
  }

  const compApi = ref.current.obj
  const forceUpdate = useUpdate();
  //赋值状态变量(函数中调用)
  const doForceUpdate = usePersistFn(obj => {
      for (const [key, value] of Object.entries(obj)) {
          compApi[key] = value;
      }
      forceUpdate();
  });


  return [compApi,doForceUpdate]; //注意此直接返回普通js对象
}

//依赖关系比较
function depsAreSame(oldDeps, deps) {
  if (oldDeps === deps) return true;
  for (let i in oldDeps) {
    if (oldDeps[i] !== deps[i]) return false;
  }
  return true;
}
/*
useCreation 是 useMemo 或 useRef 的替代品。

因为 useMemo 不能保证被 memo 的值一定不会被重计算，而 useCreation 可以保证这一点。以下为 React 官方文档中的介绍：

You may rely on useMemo as a performance optimization, not as a semantic guarantee.In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then add it to optimize performance.

而相比于 useRef，你可以使用 useCreation 创建一些常量，这些常量和 useRef 创建出来的 ref 有很多使用场景上的相似，但对于复杂常量的创建，useRef 却容易出现潜在的性能隐患。

const a = useRef(new Subject()) // 每次重渲染，都会执行实例化 Subject 的过程，即便这个实例立刻就被扔掉了
const b = useCreation(() => new Subject(), []) // 通过 factory 函数，可以避免性能隐患

mport React, { useState } from 'react';
import { Button } from 'antd';
import { useCreation } from 'hooks';

class Foo {
  constructor() {
    this.data = Math.random()
  }
  data: number
}

export default function () {
  const foo = useCreation(() => new Foo(), [])
  const [, setFlag] = useState({})
  return (
    <>
      <p>
        {foo.data}
      </p>
      <Button onClick={() => {setFlag({})}}>Rerender</Button>
    </>
  );
}

const useInstance = (initialValueOrFunction = {}) => {
  const ref = useRef();
  if (!ref.current) {
    ref.current = typeof initialValueOrFunction === 'function'
      ? initialValueOrFunction()
      : initialValueOrFunction;
  }
  return ref.current;
};


   const flagRef = useRef(flag);	
    flagRef.current = flag;
参数
参数	说明	类型	默认值
factory	用来创建所需对象的函数	() => any	-
deps	传入依赖变化的对象	any[]	-


useRef
    const refContainer = useRef(initialValue);
注意：useRef返回相当于一个{current: ...}的plain object，但是和正常这样每轮render之后直接显式创建的区别在于，每轮render之后的useRef返回的plain object都是同一个，只是里面的current发生变化

而且，当里面的current发生变化的时候并不会引起render

作者：XJBT
链接：https://www.jianshu.com/p/fd17ce2d7e46
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


const { useRef } = require('react');

function useProperty(prop) {
  const propInstance = useRef(prop);
  propInstance.current = prop;
  return useRef(
    typeof prop === 'function' ? (...all) => propInstance.current(...all) : prop
  ).current;
}

function useProperties(...properties) {
  return properties.map(useProperty);
}

module.exports = {
  useProperty,
  useProperties
*/
