import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'

// 分组
function Grouping() {
    const columns = React.useMemo(
      () => [
        {
          Header: 'Name',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
              // Use a two-stage aggregator here to first
              // count the total rows being aggregated,
              // then sum any of those counts if they are
              // aggregated further
              aggregate: 'count',
              Aggregated: ({ value }) => `${value} Names`,
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              // Use another two-stage aggregator here to
              // first count the UNIQUE values from the rows
              // being aggregated, then sum those counts if
              // they are aggregated further
              aggregate: 'uniqueCount',
              Aggregated: ({ value }) => `${value} Unique Names`,
            },
          ],
        },
        {
          Header: 'Info',
          columns: [
            {
              Header: 'Age',
              accessor: 'age',
              // Aggregate the average age of visitors
              aggregate: 'average',
              Aggregated: ({ value }) => `${value} (avg)`,
            },
            {
              Header: 'Visits',
              accessor: 'visits',
              // Aggregate the sum of all visits
              aggregate: 'sum',
              Aggregated: ({ value }) => `${value} (total)`,
            },
            {
              Header: 'Status',
              accessor: 'status',
            },
            {
              Header: 'Profile Progress',
              accessor: 'progress',
              // Use our custom roundedMedian aggregator
              aggregate: roundedMedian,
              Aggregated: ({ value }) => `${value} (med)`,
            },
          ],
        },
      ],
      []
    )

    const data = React.useMemo(() => makeData(100000), [])
    return (
        <div style={{ padding: 20 }}>
            <h3><a name='grouping'>分组</a></h3>
            <RTable
                columns={columns}
                data={data}
                //默认根据firstName分组
                groupBy={['age']}
                isExpanded  //设置展开可见
                virtualizedRows={{allRowsHeight:500}}  //虚拟行  
                celled
            />
        </div>
    )
}

export default Grouping


// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
function roundedMedian(leafValues) {
    let min = leafValues[0] || 0
    let max = leafValues[0] || 0
  
    leafValues.forEach(value => {
      min = Math.min(min, value)
      max = Math.max(max, value)
    })
  
    return Math.round((min + max) / 2)
}