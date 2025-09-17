import React from 'react';
import SpendableRow from "../SpendableRow.jsx";
import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:4,
    FP:4,
    START_LEVEL:1,
};

function Attribute({ attribute, useGroup, setAttribute, collapsed })
{
    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL,COSTS.START_LEVEL);
    }

    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:attribute});
    },[attribute]);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value,
        });
        setAttribute(useGroup, attribute.name, field, value);
    };

    return (<SpendableRow collapsed={collapsed} handleChange={handleChange} state={state}></SpendableRow>);
}

export default Attribute;
