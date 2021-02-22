import { useRef } from 'react';
export default function useCreationAsyc(factory, allowRunInit, deps) {
  const ref = useRef({
    deps,
    obj: undefined,
    initialized: false,
  });
  if (!ref) {
    throw new Error('存在内存泄漏！重新渲染时无法创建useRef.');
  }
  if (allowRunInit && (ref.current.initialized === false || !depsAreSame(ref.current.deps, deps))) {
    //只有第1次或依赖被动时才会 执行factory实例化函数，【多次执行始终是同一个实例化的对象】
    ref.current.deps = deps;
    if (typeof factory === 'function') {
      ref.current.obj = factory(); //实例化函数返回的对象
    } else {
      ref.current.obj = factory;
    }
    ref.current.initialized = true;
    //console.log('useCreationAsyc 初始完完成...');
    /*
    factory().then(res => {
      //console.log('useCreationAsyc', res); //data
      current.obj = res; //实例化函数返回的对象
      current.initialized = true;
      return current.obj;
    });*/
  }
  return ref.current.obj; //注意此直接返回对象
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
//let formStore = useCreationAsyc(() => firstInit(), []); //变量3 !allowIniti ||

*/
