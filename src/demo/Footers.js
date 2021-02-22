import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'
//表格页脚用法
//注意colums要设置Footer
//showFooter开启

function Footers() {
    const columns = React.useMemo(
        () => [
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
                        Footer: info => {
                            // Only calculate total visits if rows change
                            const total = React.useMemo(
                                () =>
                                    info.rows.reduce((sum, row) => row.values.visits + sum, 0),
                                [info.rows]
                            )

                            return <>Total: {total}</>
                        },
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
        []
    )


    const data = React.useMemo(() => makeData(20), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='footers'>页脚</a></h3>
            <RTable
                columns={columns}
                data={data}
                showFooter
                // customFooter={()=><div>123</div>}  自定义Footer组件
            />
        </div>
    )
}

export default Footers