import React, { useEffect, } from 'react'
import { useTable, useSortBy, usePagination, useRowSelect, useExpanded, useGroupBy, useColumnOrder, useResizeColumns, useFlexLayout, useFilters, useGlobalFilter } from '../../react-table'
import { Icon, Table, Dimmer, Loader, } from 'semantic-ui-react'
import { useCreation, usePersistFn } from '../../hooks'


import TablePagination from '../TablePagination'
import IndeterminateCheckbox from '../IndeterminationCheckbox'
import Toolbar from '../Toolbar'
import TableFooter from '../TableFooter'
import TableBodyRender from '../TableBody'
import { GlobalFilter, DefaultColumnFilter } from '../FilterTypeCom'

import { useControlledState } from './customHook'


import { FixedSizeList } from 'react-window'

import { fuzzyTextFilterFn } from './util'


import "./styles.css"
import 'semantic-ui-css/semantic.min.css'

// Create a default prop getter
const defaultPropGetter = () => ({})

function RTable({
  columns,
  data,
  showFooter, //是否显示页脚
  customFooter, //自定义页脚组件
  sortable,//排序
  paginationConfig,//分页
  rowSelection, //行选择
  isExpanded, //子节点是否展开
  selectable, //行是否可点击
  renderRowSubComponent,//渲染行子组件
  updateData, //可编辑表格 更新数据
  defaultColumn, //列属性
  canResize,//调整列宽 
  loading, //loading 加载中
  groupBy,  //是否分组
  filter, //表头过滤
  filterGlobal, //全局过滤
  columsCanHidden,//列隐藏控制
  getHeaderProps = defaultPropGetter, 
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  virtualizedRows,//虚拟列
  ...otherProps  //可传入其他semantic的属性
}) {

  //初始值 为useTable提供默认值
  const [compApi] = useCreation(() => {
    // 默认
    let initValue = {
      columns,
      data,
      defaultColumn: defaultColumn || {},
      // updateData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateData,  //可编辑表格时 自定义更新数据函数

    }

    //初始state
    let initState = () => {
      let state = {}
      //分页配置
      if (paginationConfig) {
        state = {
          ...state,
          pageSize: paginationConfig?.pageSize || 10,
          pageIndex: (paginationConfig?.pageIndex) - 1 || 1,
        }
      }
      // 行选中
      if (rowSelection) {
        state = {
          ...state,
          selectedRowIds: rowSelection?.selectedRowIds || {}
        }
      }
      //初始分组
      if (groupBy && groupBy.length) {
        state = {
          ...state,
          groupBy
        }
      }
      return state
    }

    initValue = {
      ...initValue,
      initialState: initState()
    }

    //过滤类型
    if (filter) {
      initValue = {
        ...initValue,
        // 过滤
        filterTypes: {
          // Add a new fuzzyTextFilterFn filter type.
          fuzzyText: fuzzyTextFilterFn,
          // Or, override the default text filter to use
          // "startWith"
          text: (rows, id, filterValue) => {
            return rows.filter(row => {
              const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
                : true
            })
          },
        },
        // 默认列
        defaultColumn: {
          ...initValue.defaultColumn,
          //过滤默认使用组件
          Filter: DefaultColumnFilter
        },
      }
    }

    return initValue
  }, [defaultColumn, paginationConfig, rowSelection, groupBy, filter])


  //hook
  //调整列宽插件 
  const [ResizePlugin] = useCreation(() => {
    return {
      // 可调节列宽 / 虚拟行  采用flex布局
      useFlexLayout: ((canResize || virtualizedRows) && useFlexLayout) || '',
    }
  }, [canResize, virtualizedRows])



  //核心
  // Use the state and functions returned from useTable to build your UI
  const {
    //基本
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //页脚
    footerGroups,

    //=====分页===
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    //初始状态
    state,
    //=====分页===

    //显示的最大列数
    visibleColumns,

    //行勾选
    selectedFlatRows,  //被选中的行数据
    selectedRows,//ztt add 被选中的行数据
    isAllRowsSelected,  //判断当前所有数据是否被全选
    isAllPageRowsSelected, //判断当前页是否被全选
    getToggleAllRowsSelectedProps, //获取所有行全选的属性值

    //所有cloumns
    allColumns,
    setHiddenColumns,  //设置隐藏的列

    //过滤
    preGlobalFilteredRows,
    setGlobalFilter
    
  } = useTable(

    // ======默认配置
    compApi,
    //=========插件配置

    //过滤
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!

    useResizeColumns,  //调整列宽
    useColumnOrder,//列调换位置
    useGroupBy,//分组
    useSortBy,  //排序
    useExpanded, //行展开
    usePagination, //分页
    useRowSelect,//行勾选
    ResizePlugin.useFlexLayout,  //flex布局插件
    hooks => {
      //增加展开箭头 适用多级数据
      if (isExpanded) {
        hooks.useControlledState.push(useControlledState)
        hooks.visibleColumns.push((columns, { instance }) => {
          //如果没有分组 直接返回值
          if (groupBy && !instance.state.groupBy.length) {
            return columns
          }
          return [
            {
              // 设置展开列
              // Build our expander column
              id: 'expander', // Make sure it has an ID
              Header: ({ allColumns, state: { groupBy }, getToggleAllRowsExpandedProps, isAllRowsExpanded }) => {
                const RenderExpand = () => {  //控制头部整列展开状态
                  return (
                    <span {...getToggleAllRowsExpandedProps()}>
                      {isAllRowsExpanded ? <Icon name="angle down" /> : <Icon name="angle right" />}
                    </span>
                  )
                }
                if (groupBy) {  //分组
                  return groupBy.map(columnId => {
                    const column = allColumns.find(d => d.id === columnId)
                    return (
                      <span {...column.getHeaderProps(tableProps.headerProps)} key={column.id}>
                        <RenderExpand />
                        {column.canGroupBy ? (
                          // If the column can be grouped, let's add a toggle
                          <span {...column.getGroupByToggleProps()}>
                            {column.isGrouped ? <Icon name="circle" /> : <Icon name="circle outline" />}
                          </span>
                        ) : null}
                        {column.render('Header')}{' '}
                      </span>
                    )
                  })
                } else {
                  return <RenderExpand />
                }
              }
              ,
              Cell: ({ row }) => {
                // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                // to build the toggle for expanding a row
                if (row.canExpand) {

                  const groupedCell = row.allCells.find(d => d.isGrouped)
                  return (
                    <span
                      {...row.getToggleRowExpandedProps({
                        style: {
                          // We can even use the row.depth property
                          // and paddingLeft to indicate the depth
                          // of the row
                          paddingLeft: `${row.depth * 2}rem`,
                        },
                      })}
                    >
                      {row.isExpanded ? <Icon name="angle down" /> : <Icon name="angle right" />}
                      {(groupBy && groupBy.length) ?
                        <>
                          {groupedCell.render('Cell')}
                          {' '}
                          {/* 统计数字 */}
                          ({row.subRows.length})
                        </> : null}
                    </span>
                  )
                }
                return null

              },
              // We can override the cell renderer with a SubCell to be used with an expanded row
              SubCell: () => null // No expander on an expanded row
            },
            ...columns,
          ]
        })
      }

      //增加行选择列
      if (rowSelection) {
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            //NOTE: 下面根据传入的值不同 全选按钮分为两类  =》"getToggleAllPageRowsSelectedProps"当前页全选  "getToggleAllRowsSelectedProps"所有数据全选
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()}/>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()}  />
            ),
          },
          ...columns,
        ])
      }

    },

  )

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  useEffect(() => {
    rowSelection?.onChange?.(state.selectedRowIds, selectedRows)
  }, [rowSelection,state.selectedRowIds,selectedRows])

  //点击全选当前页所有行回调
  useEffect(() => {
    rowSelection?.onAllPageRowsSelected?.(isAllPageRowsSelected)
  }, [rowSelection,isAllPageRowsSelected])


  //点击全选所有行回调
  useEffect(() => {
    rowSelection?.onAllRowsSelected?.(isAllRowsSelected)
  }, [rowSelection,isAllRowsSelected])


  //表格渲染提供Props
  const [tableProps] = useCreation(() => {
    //Table Header 属性
    const headerRoot = () => {
      let bgColor = "#f9fafb"

      //根据主题变换表头背景颜色
      if (otherProps?.basic) {
        bgColor = 0
      } else if (otherProps?.inverted) {
        bgColor = 'rgba(0,0,0,.15)'
      }

      return {
        style: {
          background: bgColor
        }
      }
    }
    //Table Header Row 属性
    const headerGroupProps = (props, { index }) => {

      if (virtualizedRows) {
        return [
          props,
          {
            style: {
              maxWidth: 'calc(100% - 10px)',
              borderRight: '1px solid rgba(34,36,38,.1)'
            }
          }
        ]
      }
      return [props]
    }
    //Table Header cell属性
    const headerProps = (props, { column }) => {
      const align = column.align || 'left'
      let newProps = [
        props,
        {
          className: column.className,
          style: {
            ...column.style,
            textAlign: align  //设置表头值的位置
          },
        }
      ]

      //外部传入自定义属性
      let otherProps = [
        getColumnProps(column),
        getHeaderProps(column),
      ]
      //增加排序点击事件
      if (sortable) {
        newProps.push(column.getSortByToggleProps())
      }

      return [...newProps, ...otherProps]
    }
    //Table Body Cell 属性
    const cellProps = (props, { cell }) => {
      const align = cell.column.align || 'left'
      return [
        props,
        {
          className: cell.column.className,
          style: {
            ...cell.column.style,
            textAlign: align,//设置单元格值的位置

          },
        },
        getColumnProps(cell.column),
        getCellProps(cell),
      ]

    }

    return {
      headerRoot,
      headerGroupProps,
      headerProps,
      cellProps
    }
  }, [sortable, columns])

  //Table body内容渲染
  const tableBodyRender = () => {
    //根据是否分页区分渲染
    let data = (paginationConfig && page) || rows

    return data.map(row => {

      prepareRow(row)
      const rowProps = row.getRowProps();
      return (
        <div  key={row.id}>
          <Table.Row {...row.getRowProps()}>
            {row.cells.map((cell) => {
              let collapsing = false
              //设置checkbox列紧凑型  
              if (cell.column.id === "selection") {
                collapsing = true
              }
              return <Table.Cell {...cell.getCellProps(tableProps.cellProps)} collapsing={collapsing} key={cell.row.id + cell.column.id}>
                {/* 分组 */}
                {(groupBy && cell.isAggregated) ? (
                  // If the cell is aggregated, use the Aggregated
                  // renderer for cell
                  cell.render('Aggregated')
                ) : (groupBy && cell.isPlaceholder) ? null : ( // For cells with repeated values, render null
                  // Otherwise, just render the regular cell
                  cell.render('Cell')
                )}

              </Table.Cell>
            })}
          </Table.Row>

          {/*
            渲染行子组件
            If the row is in an expanded state, render a row with a
            column that fills the entire length of the table.
          */}
          {row.isExpanded && renderRowSubComponent?.({ row, rowProps, visibleColumns })}
        </div>
      )
    })
  }

  //虚拟渲染行
  const RenderRow = usePersistFn(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)

      const cellProps = (props, { cell }) => {
        const align = cell.column.align

        return {
          style: {
            ...cell.column.style,
            flex: 1,
            textAlign: align,//设置单元格值的位置
          }
        }
      }
      return (
        <Table.Row
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map(cell => {
            return (
              <Table.Cell {...cell.getCellProps(cellProps)} key={cell.row.id + cell.column.id}>
                {cell.render('Cell')}
              </Table.Cell>
            )
          })}
        </Table.Row>
      )
    },
    [prepareRow, rows]
  )

  // Render the UI for your table
  return (
    // 控制loading
    <Dimmer.Dimmable dimmed={loading} >
      <Dimmer active={loading} inverted>
        <Loader>Loading</Loader>
      </Dimmer>

      {/* 工具区：列隐藏 ...(后续可加功能)*/}
      {columsCanHidden &&
        <Toolbar
          allColumns={allColumns}
          setHiddenColumns={setHiddenColumns}
          className="margin-b-s"
        />}
      <main className="container" >
        {/* 核心Table */}
        <Table {...getTableProps()}
          className="RTable"
          sortable={sortable}
          selectable={selectable}
          {...otherProps}
        >
          {/* 头部渲染 */}
          <Table.Header {...tableProps.headerRoot()} >
            {headerGroups.map((headerGroup, i) => (
              <Table.Row {...headerGroup.getHeaderGroupProps(tableProps.headerGroupProps)} key={i}>
                {headerGroup.headers.map(column => (
                  <Table.HeaderCell {...column.getHeaderProps(tableProps.headerProps)}
                    key={column.id}
                    //列排序
                    sorted={column.isSorted
                      ? column.isSortedDesc
                        ? 'descending'
                        : 'ascending'
                      : null}
                  >
                    {(groupBy && column.canGroupBy) ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? <Icon name="circle" /> : <Icon name="circle outline" />}
                      </span>
                    ) : null}
                    {column.render('Header')}
                    {/* Render the columns filter UI */}
                    {filter && <div>{column.canFilter ? column.render('Filter') : null}</div>}
                    {/* 列宽调整 */}
                    {canResize && <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? 'isResizing' : ''
                        }`}
                    />}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            ))}

            {/* 整行全局过滤 */}
            {filter && filterGlobal && (<Table.Row>
              <Table.HeaderCell
                colSpan={visibleColumns.length}
                style={{
                  textAlign: 'left',
                }}>
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </Table.HeaderCell>
            </Table.Row>)}
          </Table.Header>
          {/* 内容渲染 */}
          <Table.Body {...getTableBodyProps()}>
            {/* 虚拟化 */}
            {virtualizedRows ? 

            <FixedSizeList
              // 表格内容高默认400
              height={virtualizedRows.allRowsHeight || 400}
              itemCount={rows.length}
              itemSize={35}
            >
              {RenderRow}
            </FixedSizeList> 
            : 
            
            <TableBodyRender
            paginationConfig={paginationConfig}
            page={page}
            rows ={rows}
            renderRowSubComponent ={renderRowSubComponent}
            visibleColumns ={visibleColumns}
            groupBy ={groupBy}
            cellProps={tableProps.cellProps}
            prepareRow={prepareRow}
            />}
          </Table.Body>

          {/* 页脚渲染 */}
          {(showFooter || paginationConfig) && (
            <Table.Footer>
              {/* 页脚 */}
              {showFooter && <TableFooter footerGroups={footerGroups} customFooter={customFooter} />}
              {/* 分页 */}
              {paginationConfig && (
                <TablePagination
                  setPageSize={setPageSize}
                  gotoPage={gotoPage}
                  visibleColumnsLen={visibleColumns.length}
                  isAllCheck={rowSelection}
                  pageIndex={state.pageIndex}
                  pageSize={state.pageSize}
                  pageSizeSelectOption={paginationConfig?.pageSizeSelectOption}
                  pageOptionsLen={pageOptions.length}
                  canPreviousPage={canPreviousPage}
                  canNextPage={canNextPage}
                  nextPage={nextPage}
                  pageCount={pageCount}
                  previousPage={previousPage}
                  getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}

                />)}
            </Table.Footer>
          )}
        </Table>
      </main>
    </Dimmer.Dimmable>
  )
}



//设置默认值
RTable.defaultProps = {
  columns: [],
  data: [],
  showFooter: false,
  sortable: false,
  selectable: false,
  isExpanded: false,
  canResize: false,
  filter: false,
  filterGlobal: true,
  columsCanHidden: false,
  virtualizedRows: false
}

export default RTable

