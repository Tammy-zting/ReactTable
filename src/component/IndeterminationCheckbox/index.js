import React, { forwardRef, useRef } from 'react';
import { Checkbox } from 'semantic-ui-react';

//行勾选
const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef()
        const resolvedRef = ref || defaultRef
        return (
            <Checkbox ref={resolvedRef} indeterminate={indeterminate} {...rest} />
        )
    }
)


export default IndeterminateCheckbox