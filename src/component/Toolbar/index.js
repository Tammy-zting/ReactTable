import React from 'react';
import { useCreation, usePersistFn } from '../../hooks'
import { Dropdown } from 'semantic-ui-react'

// 工具条
const Toolbar = ({ allColumns, setHiddenColumns, className }) => {

  const [compApi] = useCreation(() => {

    return {
      defaultValue: allColumns.map(column => column.id),
      columnsOption: allColumns.map(column => {
        return {
          key: column.id,
          text: column.id,
          value: column.id
        }
      })
    }
  }, [])

  const onhiddenColumns = usePersistFn((e, { value }) => {
    const hiddenColumns = allColumns.filter(column => !value.includes(column.id))
    setHiddenColumns(hiddenColumns.map(columns => columns.id))
  })

  return (
    <div className={className}>
      <label className="baseLabel">显示的列:</label>
      <Dropdown
        placeholder='显示的列'
        multiple
        search
        selection
        options={compApi.columnsOption}
        defaultValue={compApi.defaultValue}
        onChange={onhiddenColumns}
      />
    </div>
  )
}

export default Toolbar;