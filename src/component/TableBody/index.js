import React from 'react'
import {Table} from 'semantic-ui-react'

const TableBodyRender = ({
    paginationConfig,
    page,
    rows,
    renderRowSubComponent,
    visibleColumns,
    groupBy,
    cellProps,
    prepareRow
}) => {
    //根据是否分页区分渲染
    let data = (paginationConfig && page) || rows

    return data.map(row => {
            prepareRow(row)
            const rowProps = row.getRowProps();
            return (
                <>
                    <Table.Row {...row.getRowProps()} key={row.id}>
                        {row.cells.map((cell) => {
                            let collapsing = false
                            //设置checkbox列紧凑型  
                            if (cell.column.id === "selection") {
                                collapsing = true
                            }
                            return <Table.Cell {...cell.getCellProps(cellProps)} collapsing={collapsing} key={cell.row.id + cell.column.id}>
                                {/* 分组 */}
                                {(groupBy && cell.isAggregated) ? (
                                    // If the cell is aggregated, use the Aggregated
                                    // renderer for cell
                                    cell.render('Aggregated')
                                ) : (groupBy && cell.isPlaceholder) ? null : ( // For cells with repeated values, render null
                                    // Otherwise, just render the regular cell
                                    cell.render('Cell')
                                )}

                            </Table.Cell>
                        })}
                    </Table.Row>

                    {/*
                        渲染行子组件
                        If the row is in an expanded state, render a row with a
                        column that fills the entire length of the table.
                    */}

                    {row.isExpanded && renderRowSubComponent?.({ row, rowProps, visibleColumns })}
                </>
            )
        }
    )
}


export default TableBodyRender