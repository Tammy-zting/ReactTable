import React from 'react'
import { Table } from 'semantic-ui-react'

//页脚渲染
function TableFooter({ footerGroups,customFooter }) {

    //自定义Footer组件
    if(customFooter){
        return customFooter()
    }

    return footerGroups.map(group => (
        <Table.Row {...group.getFooterGroupProps()}>
           {group.headers.map(column => {
                return column.hasOwnProperty('Footer') ? <Table.HeaderCell {...column.getFooterProps()}>{column.render('Footer')}</Table.HeaderCell> : null
            })}
        </Table.Row>)
    )
}


export default TableFooter

