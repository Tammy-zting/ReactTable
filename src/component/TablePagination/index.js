import React from 'react';
import { useCreation, usePersistFn } from '../../hooks'
import { Icon, Table, Pagination, Select, Input } from 'semantic-ui-react'
import IndeterminateCheckbox from '../IndeterminationCheckbox'
import "./index.css"
function TablePagination({
    setPageSize,
    gotoPage,
    visibleColumnsLen,
    isAllCheck,
    pageIndex,
    pageSize,
    pageSizeSelectOption,
    pageOptionsLen,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    getToggleAllRowsSelectedProps
}) {
    const [compApi] = useCreation(() => ({

        defaultPageSizeSelectOption: [
            { key: '10', value: 10, text: '10条' },
            { key: '20', value: 20, text: '20条' },
            { key: '30', value: 30, text: '30条' },
            { key: '40', value: 40, text: '40条' },
            { key: '50', value: 50, text: '50条' },
        ]
    }), [])


    const onSelectChange = usePersistFn((e, { value }) => {
        setPageSize(Number(value))
    });


    //跳转页
    const onPageChange = usePersistFn((e, { activePage }) => {
        gotoPage(activePage - 1)
    })

    return (
        <Table.Row>
            <Table.HeaderCell colSpan={visibleColumnsLen} >
                <div className="TablePagination">
                    {/* 所有记录全选 */}
                    <section>{isAllCheck && 
                        (<><IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        <label> 全选</label></>)}
                    </section>

                    {/* 分页 */}
                    <main>
                        <div className="goPage">
                            <label>跳转到：</label>
                            <Input type="number"
                                defaultValue={pageIndex + 1}
                                onChange={(e, { value }) => {
                                    const page = value ? Number(value) - 1 : 0
                                    gotoPage(page)
                                }}
                                min="1"
                                max={pageSize}
                                className="jy tiny"
                                value={pageIndex + 1}
                            />
                        </div>
                        {pageSizeSelectOption === false ? null : (
                            <div className="pageSize">
                                <label> 显示：</label>
                                <Select
                                    className="jy tiny"
                                    value={pageSize}
                                    onChange={onSelectChange}
                                    options={pageSizeSelectOption || compApi.defaultPageSizeSelectOption}
                                />
                            </div>)
                        }
                        <Pagination
                            defaultActivePage={pageIndex + 1}
                            totalPages={pageOptionsLen}
                            firstItem={{ content: <Icon name='angle double left' />, disabled: !canPreviousPage, icon: true, onClick: () => gotoPage(0) }}
                            lastItem={{ content: <Icon name='angle double right' />, disabled: !canNextPage, icon: true, onClick: () => gotoPage(pageCount - 1) }}
                            prevItem={{ content: <Icon name='angle left' />, disabled: !canPreviousPage, icon: true, onClick: () => previousPage() }}
                            nextItem={{ content: <Icon name='angle right' />, disabled: !canNextPage, icon: true, onClick: () => nextPage() }}
                            className="jy tiny"
                            onPageChange={onPageChange}
                            activePage={pageIndex + 1}
                        />
                    </main>
                </div>
            </Table.HeaderCell>
        </Table.Row>
    )

}

export default TablePagination