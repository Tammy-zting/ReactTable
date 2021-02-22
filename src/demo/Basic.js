import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'
//基础用法
function Basic() {


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
                        align: 'right'  //设置align 调整显示位置 默认left 
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

    const data = React.useMemo(() => makeData(20), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='basic'>基础</a></h3>
            <RTable
                columns={columns}
                data={data}
                celled
                // ...可传入semantic其他属性改变表格样式
            />
        </div>
    )
}

export default Basic