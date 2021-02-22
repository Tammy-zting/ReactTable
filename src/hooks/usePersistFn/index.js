import { useCallback, useRef } from 'react';
function usePersistFn(fn) {
  const ref = useRef(() => {
    throw new Error('Cannot call function while rendering.');
  });
  ref.current = fn;
  const persistFn = useCallback((...args) => ref.current(...args), [ref]);
  return persistFn;
}
export default usePersistFn;
/*
持久化 function 的 Hook

参考 如何从 useCallback 读取一个经常变化的值？

在某些场景中，你可能会需要用 useCallback 记住一个回调，但由于内部函数必须经常重新创建，
记忆效果不是很好，导致子组件重复 render。对于超级复杂的子组件，重新渲染会对性能造成影响。通过 usePersistFn，可以保证函数地址永远不会变化。

import React, { useState, useCallback, useRef } from 'react';
import { Button, message } from 'antd';
import { usePersistFn } from 'hooks';

export default () => {
  const [count, setCount] = useState(0);

  const showCountPersistFn = usePersistFn(() => {
    message.info(`Current count is ${count}`);
  });

  const showCountCommon = useCallback(
    () => {
      message.info(`Current count is ${count}`);
    },
    [count],
  )

  return (
    <>
      <Button onClick={() => { setCount(c => c + 1) }}>Add Count</Button>
      <p>You can click the button to see the number of sub-component renderings</p>

      <div style={{ marginTop: 32 }}>
        <h4>Component with persist function:</h4>
         <ExpensiveTree showCount={showCountPersistFn} />
      </div>
      <div style={{ marginTop: 32 }}>
        <h4>Component without persist function:</h4>
         <ExpensiveTree showCount={showCountCommon} />
      </div>
    </>
  );
};

// some expensive component with React.memo
const ExpensiveTree = React.memo<{ [key] }>(({ showCount }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <Button onClick={showCount}>showParentCount</Button>
    </div>
  )
})
*/
