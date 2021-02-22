import React from 'react'
import makeData from './makeData'
import 'semantic-ui-css/semantic.min.css'
import { useCreation, usePersistFn } from './hooks'
import RTable from './component/RTable'
import { Input} from 'semantic-ui-react'


function App() {

  //数据源
  const [compApi, doForceUpdate] = useCreation(() => {

    return {
      // 初始选中行id
      selectedRowIds: { '2.4.0': true, '2.4.1': true },  
      //行展开
      columns: [
        {
          Header: 'ID',
          accessor: 'id',
        },
        {
          Header: 'Name',
          Footer: 'Name',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
              Footer: 'First Name',
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              Footer: 'Last Name',
            },
          ],
        },
        {
          Header: 'Info',
          Footer: 'Info',
          columns: [
            {
              Header: 'Age',
              accessor: 'age',
              Footer: 'Age',
            },
            {
              Header: 'Visits',
              accessor: 'visits',
              // Footer: info => {
              //   // Only calculate total visits if rows change
              //   const total = React.useMemo(
              //     () =>
              //       info.rows.reduce((sum, row) => row.values.visits + sum, 0),
              //     [info.rows]
              //   )

              //   return <>Total: {total}</>
              // },
            },
            {
              Header: 'Status',
              accessor: 'status',
              Footer: 'Status',
            },
            {
              Header: 'Profile Progress',
              accessor: 'progress',
              Footer: 'Profile Progress',
            },
          ],
        },
      ],
      data: makeData(1000)  //模拟数据 
    }
  }, [])

  //渲染行子组件
  // Create a function that will render our row sub components
  // const renderRowSubComponent = React.useCallback(
  //   ({ row }) => (
  //     <pre
  //       style={{
  //         fontSize: '10px',
  //       }}
  //     >
  //       <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
  //     </pre>
  //   ),
  //   []
  // )

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    []
  );

  // 行选中回调
  const onRowSelection = usePersistFn((selectedRowIds, selectedRows) => {
    console.log('获取当前选中的所有行id,所有行值', { selectedRowIds, selectedRows })
  })

  //当前页全选按钮回调
  const onAllPageRowsSelected = usePersistFn(value => {
    console.log("当前页记录是否全选", value)
  })

  //当有分页时 所有记录全选按钮回调
  const onAllRowsSelected = usePersistFn(value => {
    console.log("所有记录是否全选", value)
  })


  //可编辑表格 更新数据
  const updateMyData = usePersistFn((row, columnId, value) => {
    console.log("更新数据")
    console.log({row, columnId, value})
    //TODO:根据数据 编辑表格后修改数据  这里只修改了一层作为例子
    let {index} = row
    compApi.data[index] = {...compApi.data[index],value:value}
    doForceUpdate({data:compApi.data})
  })


  return (
    <div style={{ margin: 20,padding:20, border: "1px solid green" }}>
      <RTable
        columns={compApi.columns} data={compApi.data}
        showFooter
        sortable
        // 分页
        paginationConfig={{
          pageSize:20,  //当前显示最大列值
          pageIndex:5,  //当前激活页码
          pageSizeSelectOption :[   //当前显示可选最大列值  设置false即不显示 默认显示
            { key: '20', value: 20, text: '20条' },
            { key: '30', value: 30, text: '30条' },
            { key: '40', value: 40, text: '40条' },
            { key: '50', value: 50, text: '50条' },
            { key: '60', value: 60, text: '60条' },
          ]
        }}
        rowSelection={{
          selectedRowIds: compApi.selectedRowIds,
          onChange: onRowSelection,   //行选择
          onAllPageRowsSelected,  //当前页全选
          onAllRowsSelected   //所有行全选
        }}
        // isExpanded //子是否可展开
        selectable  //行hover
        renderRowSubComponent={renderRowSubComponent}  //渲染行子组件 这个例子是异步加载子组件
        
        // 可编辑单元格
        updateData={updateMyData} //可编辑表格更新数据
        //TODO:分开设置
        // components={
        //   {
        //     Cell:EditableCell,
        //     // 下面设置默认的列宽 需要打开canResize属性才会生效 
        //     minWidth: 16,
        //     width: 25,
        //     maxWidth: 400,
        //   }
        // }

        // 列调换  TODO:
        // updateColumnOrder = {updateColumnOrder}
        // canResize  //列宽可调整  配置components里的属性设置列宽
        // loading

      />
    </div>
  )
}

export default App

//创建可编辑的单元格
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
}) => {

  const [cellApi, doForceUpdate] = useCreation(() => {
    return {
      value: initialValue,
      isEditing: false
    }
  }, [])

  const onChange = usePersistFn(e => {
    doForceUpdate({ value: e.target.value })
  })

  // We'll only update the external data when the input is blurred
  const onBlur = usePersistFn(() => {
    doForceUpdate({ isEditing: !cellApi.isEditing })
    updateData(row, id, cellApi.value)  //失去焦点更新数据
  })

  const onFocus = usePersistFn(() => {
    doForceUpdate({ isEditing: !cellApi.isEditing })
  })

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    doForceUpdate({ value: initialValue })
  }, [initialValue])

  return <Input value={cellApi.value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} transparent={!cellApi.isEditing} />
}

// This could be inlined into SubRowAsync, this this lets you reuse it across tables
function SubRows({ row, rowProps, visibleColumns, data, loading }) {
  if (loading) {
    return (
      <tr>
        <td/>
        <td/>
        <td colSpan={visibleColumns.length - 1}>
          Loading...
        </td>
      </tr>
    );
  }


  return (
    <>
      {data.map((x, i) => {
        return (
          <tr
            {...rowProps}
            // key={`${rowProps.key}-expanded-${i}`}
          >
            {row.cells.map((cell) => {
              return (
                <td
                  {...cell.getCellProps()}
                >
                  {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                    value:
                      cell.column.accessor &&
                      cell.column.accessor(x, i),
                    row: { ...row, original: x }
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

function SubRowAsync({ row, rowProps, visibleColumns }) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setData(makeData(3));
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data}
      loading={loading}
    />
  );
}