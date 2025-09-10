import React from 'react';
import SpendableRow from '../SpendableRow.jsx'

import reducer from "./BMFReducer.jsx";

function BMFRow({background, updateBackground, collapsed})
{


    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:background});
    }, [background]);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: Number(value ?? 0),
        });

        updateBackground(background.id, field, value);
    };

    return (<SpendableRow handleChange={handleChange} state={state} collapsed={collapsed}/>);
}

export default BMFRow;