import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'

//行可选
function RowSelection() {

    const selectedRowIds = React.useMemo(() => {
        return {
            "0": true,
            "0.0": true,
            "0.1": true
        }
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                columns: [
                    {
                        Header: 'First Name',
                        accessor: 'firstName',
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'lastName',
                    },
                ],
            },
            {
                Header: 'Info',
                columns: [
                    {
                        Header: 'Age',
                        accessor: 'age',
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits',
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                    },
                    {
                        Header: 'Profile Progress',
                        accessor: 'progress',
                    },
                ],
            },
        ],
        []
    )

    const data = React.useMemo(() => makeData(10, 2), [])

    // 行选中回调
    const onRowSelection = React.useCallback((selectedRowIds, selectedRows) => {
        console.log('获取当前选中的所有行id,所有行值', { selectedRowIds, selectedRows })
    }, [])

    //当前页全选按钮回调
    const onAllPageRowsSelected = React.useCallback(value => {
        console.log("当前页记录是否全选", value)
    }, [])

    //当有分页时 所有记录全选按钮回调
    const onAllRowsSelected = React.useCallback(value => {
        console.log("所有记录是否全选", value)
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='rowSelection'>行勾选</a></h3>
            <RTable
                columns={columns}
                data={data}
                isExpanded //子是否可展开

                rowSelection={{
                    selectedRowIds: selectedRowIds, //默认选中的行id
                    onChange: onRowSelection,   //行选择
                    onAllPageRowsSelected,  //当前页全选
                    onAllRowsSelected   //所有行全选
                }}
            />
        </div>
    )
}

export default RowSelection