import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'

//设置是否可展开子节点
function Expanding() {


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

    const data = React.useMemo(() => makeData(5, 5, 5), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='expanding'>展开子</a></h3>
            <RTable
                columns={columns}
                data={data}
                isExpanded
            />
        </div>
    )
}

export default Expanding