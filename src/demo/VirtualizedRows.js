
import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'

// 虚拟列
function VirtualizedRows() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Row Index',
                accessor: (row, i) => i,
            },
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
                        width: 50,
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits',
                        width: 60,
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

    const data = React.useMemo(() => makeData(100000), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='virtualizedRows'>虚拟行</a></h3>
            <RTable
                columns={columns}
                data={data}
                virtualizedRows
            />
        </div>
    )
}

export default VirtualizedRows