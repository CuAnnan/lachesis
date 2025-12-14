import React from 'react';
import SpendableRow from '../SpendableRow.jsx'

import reducer from "./BMFReducer.jsx";

function BMFRow({item, updateItem, handleDelete, collapsed})
{
    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:item});
    }, [item]);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: field === 'specialty' ? (value ?? '') : Number(value ?? 0),
        });

        updateItem(item.id, field, value);
    };


    return (<SpendableRow handleChange={handleChange} state={state} collapsed={collapsed} isDeletable={true} handleDelete={handleDelete}/>);
}

export default BMFRow;