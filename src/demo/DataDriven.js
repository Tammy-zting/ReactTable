import React from 'react'
import RTable from '../component/RTable'
import namor from 'namor'



//自定义格子样式
function DataDriven() {


    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                columns: [
                    {
                        Header: 'First Name',
                        accessor: 'firstName',
                        className: 'user',   //设置一整列的类名
                        style: {  //设置一整列的样式
                            backgroundColor: 'green'
                        },
                    },
                ],
            },
            {
                Header: 'Scores',
                columns: [
                    {
                        Header: 'Day 1',
                        accessor: 'score0',
                    },
                    {
                        Header: 'Day 2',
                        accessor: 'score1',
                    },
                    {
                        Header: 'Day 3',
                        accessor: 'score2',
                    },
                    {
                        Header: 'Day 4',
                        accessor: 'score3',
                    },
                    {
                        Header: 'Day 5',
                        accessor: 'score4',
                    },
                    {
                        Header: 'Day 6',
                        accessor: 'score5',
                    },
                    {
                        Header: 'Day 7',
                        accessor: 'score6',
                    },
                ],
            },
        ],
        []
    )

    const data = React.useMemo(() => makeData(20), [])

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='dataDriven'>自定义 行事件、列事件、行样式、格子样式</a></h3>
            <RTable
                columns={columns}
                data={data}
                //表头点击事件
                getHeaderProps={column => ({
                    onClick: () => alert('Header!'),  //设置了自定义点击事件 则打开的排序点击事件会被覆盖
                })}
                //列点击事件
                getColumnProps={column => ({
                    onClick: () => { console.log("列点击事件Column", column) },
                })}
                getRowProps={row => ({
                    onClick: () => { console.log('行点击事件Row!', row) },
                    style: {
                        background: row.index % 2 === 0 ? 'rgba(0,0,0,.1)' : 'white',
                    },
                })}
                getCellProps={cellInfo => ({
                    style: {
                        backgroundColor: `hsl(${120 * ((120 - cellInfo.value) / 120) * -1 +
                            120}, 100%, 67%)`,
                    },
                })}
            />
        </div>
    )
}

export default DataDriven


// 模拟数据用
const range = len => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = () => {
    return {
        firstName: namor.generate({ words: 1, numbers: 0 }),
        score0: Math.floor(Math.random() * 100),
        score1: Math.floor(Math.random() * 100),
        score2: Math.floor(Math.random() * 100),
        score3: Math.floor(Math.random() * 100),
        score4: Math.floor(Math.random() * 100),
        score5: Math.floor(Math.random() * 100),
        score6: Math.floor(Math.random() * 100),
    }
}

function makeData(...lens) {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth]
        return range(len).map(d => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }

    return makeDataLevel()
}
