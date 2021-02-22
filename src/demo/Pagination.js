import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'
//分页用法
function Pagination() {
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

    const data = React.useMemo(() => makeData(1000), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='pagination'>分页</a></h3>
            <RTable
                columns={columns}
                data={data}
                // 分页
                paginationConfig={{
                    pageSize: 20,  //当前显示最大列值
                    pageIndex: 5,  //当前激活页码
                    pageSizeSelectOption: [   //当前显示可选最大列值  设置false即不显示 默认显示
                        { key: '20', value: 20, text: '20条' },
                        { key: '30', value: 30, text: '30条' },
                        { key: '40', value: 40, text: '40条' },
                        { key: '50', value: 50, text: '50条' },
                        { key: '60', value: 60, text: '60条' },
                    ]
                }}
            />
        </div>
    )
}

export default Pagination