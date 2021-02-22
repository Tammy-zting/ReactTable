import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'
import { SelectColumnFilter, SliderColumnFilter, NumberRangeColumnFilter } from '../component/FilterTypeCom'


// 表头过滤
function Filtering() {

    // 表头配置过滤组件 没有配置使用默认Input
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
                        // Use our custom `fuzzyText` filter on this column
                        filter: 'fuzzyText',
                    },
                ],
            },
            {
                Header: 'Info',
                columns: [
                    {
                        Header: 'Age',
                        accessor: 'age',
                        Filter: SliderColumnFilter,
                        filter: 'equals',
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits',
                        Filter: NumberRangeColumnFilter,
                        filter: 'between',
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                        Filter: SelectColumnFilter,
                        filter: 'includes',
                    },
                    {
                        Header: 'Profile Progress',
                        accessor: 'progress',
                        Filter: SliderColumnFilter,
                        filter: filterGreaterThan,
                    },
                ],
            },
        ],
        []
    )

    const data = React.useMemo(() => makeData(1000), [])

    // 自定义过滤函数
    // Define a custom filter filter function!
    function filterGreaterThan(rows, id, filterValue) {
        return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue >= filterValue
        })
    }

    // This is an autoRemove method on the filter function that
    // when given the new filter value and returns true, the filter
    // will be automatically removed. Normally this is just an undefined
    // check, but here, we want to remove the filter if it's not a number
    filterGreaterThan.autoRemove = val => typeof val !== 'number'


    return (
        <div style={{ padding: 20 }}>
            <h3><a name='filtering'>过滤</a></h3>
            <RTable
                columns={columns}
                data={data}   // 分页
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
                filter  //打开表头过滤功能
                filterGlobal  //开启全局过滤 同时需要打开filter
            />
        </div>
    )
}

export default Filtering