import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'

//自由列宽调整
function FullWidthColumnResizing() {


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

    const data = React.useMemo(() => makeData(20), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='fullWidthColumnResizing'>列宽可调节</a></h3>
            <RTable
                columns={columns}
                data={data}
                defaultColumn={
                    {
                        // 下面设置默认的列宽 需要打开canResize属性才会生效 
                        minWidth: 16,
                        width: 25,
                        maxWidth: 400,
                    }
                }
                canResize  //列宽可调整  配置components里的属性设置列宽
            />
        </div>
    )
}

export default FullWidthColumnResizing