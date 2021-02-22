import React from 'react'
import RTable from '../component/RTable'
import makeData from '../makeData'
import { useCreation, usePersistFn } from '../hooks'
import { Input } from 'semantic-ui-react'

//可编辑表格
function EditableData() {


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

    const [compApi, doForceUpdate] = useCreation(() => {
        return { data: makeData(20) }
    }, [])



    //可编辑表格 更新数据
    const updateMyData = usePersistFn((row, columnId, value) => {
        console.log("更新数据")
        console.log({ row, columnId, value })
        //NOTE:根据数据 编辑表格后修改数据  这里只修改了一层作为例子
        let { index } = row
        compApi.data[index] = { ...compApi.data[index], value: value }
        doForceUpdate({ data: compApi.data })
    })

    return (
        <div style={{ padding: 20 }}>
            <h3><a name='editableData'>可编辑表格</a></h3>
            <RTable
                columns={columns}
                data={compApi.data}
                //TODO:分开设置
                components={
                    {
                        Cell: EditableCell,
                    }
                }
                updateData={updateMyData} //可编辑表格更新数据

            />
        </div>
    )
}

export default EditableData



//创建可编辑的单元格
// Create an editable cell renderer
const EditableCell = ({
    value: initialValue,
    row,
    column: { id },
    updateData, // This is a custom function that we supplied to our table instance
}) => {

    const [cellApi, doForceUpdate] = useCreation(() => {
        return {
            value: initialValue,
            isEditing: false
        }
    }, [])

    const onChange = usePersistFn(e => {
        doForceUpdate({ value: e.target.value })
    })

    // We'll only update the external data when the input is blurred
    const onBlur = usePersistFn(() => {
        doForceUpdate({ isEditing: !cellApi.isEditing })
        updateData(row, id, cellApi.value)  //失去焦点更新数据
    })

    const onFocus = usePersistFn(() => {
        doForceUpdate({ isEditing: !cellApi.isEditing })
    })

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        doForceUpdate({ value: initialValue })
    }, [initialValue,doForceUpdate])

    return <Input value={cellApi.value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} transparent={!cellApi.isEditing} />
}
