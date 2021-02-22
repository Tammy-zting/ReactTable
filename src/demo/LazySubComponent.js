import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'
//加载行子组件用法
function LazySubComponent() {


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


    //渲染行子组件
    // Create a function that will render our row sub components
    const renderRowSubComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
          <SubRowAsync
            row={row}
            rowProps={rowProps}
            visibleColumns={visibleColumns}
          />
        ),
        []
      );
    return (
        <div style={{ padding: 20 }}>
            <h3><a name='lazySubComponent'>懒加载子组件</a></h3>
            <RTable
                columns={columns}
                data={data}
                isExpanded
                renderRowSubComponent={renderRowSubComponent}  //渲染行子组件 这个例子是异步加载子组件
            />
        </div>
    )
}

export default LazySubComponent



function SubRowAsync({ row, rowProps, visibleColumns }) {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setData(makeData(3));
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <SubRows
            row={row}
            rowProps={rowProps}
            visibleColumns={visibleColumns}
            data={data}
            loading={loading}
        />
    );
}


// This could be inlined into SubRowAsync, this this lets you reuse it across tables
function SubRows({ row, rowProps, visibleColumns, data, loading }) {
    if (loading) {
        return (
            <tr>
                <td />
                <td />
                <td colSpan={visibleColumns.length - 1}>
                    Loading...
          </td>
            </tr>
        );
    }


    return (
        <>
            {data.map((x, i) => {
                return (
                    <tr
                        {...rowProps}
                    // key={`${rowProps.key}-expanded-${i}`}
                    >
                        {row.cells.map((cell) => {
                            return (
                                <td
                                    {...cell.getCellProps()}
                                >
                                    {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                                        value:
                                            cell.column.accessor &&
                                            cell.column.accessor(x, i),
                                        row: { ...row, original: x }
                                    })}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </>
    );
}