import React from 'react'
// 分组hook
function useControlledState(state, { instance }) {
    return React.useMemo(() => {
      if (state.groupBy.length) {
        return {
          ...state,
          hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
            (d, i, all) => all.indexOf(d) === i
          ),
        }
      }
      return state
    }, [state])
  }

  export {useControlledState}