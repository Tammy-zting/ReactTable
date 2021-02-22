import { useCallback, useState } from 'react';
const useUpdate = () => {
  const [, setState] = useState(0);
  return useCallback(() => setState(num => num + 1), []);
};

export default useUpdate;
/*
强制组件重新渲染的 hook
//import { useUpdate } from '../../hooks';//引用说明
useUpdate();
*/
