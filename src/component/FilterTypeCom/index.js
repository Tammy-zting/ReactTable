import React from 'react'
import { Input, Select } from 'semantic-ui-react'
import { useCreation, usePersistFn } from '../../hooks'
import { useAsyncDebounce } from '../../react-table'
import './index.css'
// 行过滤组件
// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {


    const [compApi, doForceUpdate] = useCreation(() => {
        return {
            count: preGlobalFilteredRows.length,
            value: globalFilter
        }
    })

    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    const onInputChange = usePersistFn((e, { value }) => {
        doForceUpdate({ value });
        onChange(value);
    })

    return (
        <span>
            Search:{' '}
            <Input
                value={compApi.value || ""}
                placeholder={`${compApi.count} records...`}
                transparent
                onChange={onInputChange}
                defaultValue={''}

            />
        </span>
    )
}

// 默认列过滤组件
// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const [compApi] = useCreation(() => ({count:preFilteredRows.length}), [])

    const onChange = usePersistFn((e, { value }) => {
        setFilter(value || undefined) // Set undefined to remove the filter entirely
    })

    return (
        <Input
            value={filterValue || ''}
            onChange={onChange}
            placeholder={`Search ${compApi.count} records...`}
            size={"mini"}
            defaultValue={''}

        />
    )
}

//下拉过滤组件
// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const [compApi] = useCreation(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })

        let allOption = [{
            key: 'all',
            value: 'all',
            text: 'all'
        }]

        let newOptions = [...options.values()].map((option, i) => ({
            key: i,
            value: option,
            text: option
        }))


        return {options:[...allOption,...newOptions]}

    }, [id, preFilteredRows])

 
    const onChange = usePersistFn((e,{value})=>{
        if(value === 'all'){
            setFilter(undefined)
        }else{
            setFilter(value)
        }
    })

    // Render a multi-select box
    return (
        <Select
            defaultValue={'all'}
            value={filterValue}
            onChange={onChange}
            options={compApi.options}
            className="jy mini"
            
        />
    )
}


// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    // Calculate the min and max
    // using the preFilteredRows

    const [compApi] = useCreation(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return {
            min,
            max
        }
    }, [id, preFilteredRows])

    const onChange = usePersistFn((e) => {
        setFilter(parseInt(e.target.value, 10))
    })

  //FIXME:Semantic Input 缺乏Slider类型
    return (
        <>
            <Input
                type="range"
                min={compApi.min}
                max={compApi.max}
                value={filterValue || compApi.min}
                onChange={onChange}
                defaultValue={compApi.min}

            />
        </>
    )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
    const [compApi] = useCreation(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return {
            min,
            max
        }
    }, [id, preFilteredRows])


    const onChangeFromInput = usePersistFn((e, { value }) => {
        setFilter((old = []) => [value ? parseInt(value, 10) : undefined, old[1]])
    })

    const onChangeToInput = usePersistFn((e, { value }) => {
        setFilter((old = []) => [old[0], value ? parseInt(value, 10) : undefined])
    })

    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <Input
                value={filterValue[0] || ''}
                type="number"
                onChange={onChangeFromInput}
                placeholder={`Min (${compApi.min})`}
                style={{
                    marginRight: '0.5rem',
                }}
                className="jy mini"
                defaultValue={''}

            />
              <span className="NumberRangeColumnFilter to">-</span>
            <Input
                value={filterValue[1] || ''}
                type="number"
                onChange={onChangeToInput}
                placeholder={`Max (${compApi.max})`}
                style={{
                    marginLeft: '0.5rem',
                }}
                className="jy mini"
                defaultValue={''}
            />
        </div>
    )
}


export { GlobalFilter, DefaultColumnFilter,SelectColumnFilter,SliderColumnFilter,NumberRangeColumnFilter }