import React from 'react';
import SpendableRow from "../SpendableRow.jsx";
import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:4,
    FP:4,
    FIRST_LEVEL:0,
    START_LEVEL:1,
};

function Attribute({ attribute, useGroup, setAttributes })
{
    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL,COSTS.START_LEVEL);
    }

    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:attribute});
    },[]);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value ? parseInt(value) : 0,
        });

        setAttributes({
            type: 'updateAttribute',
            useGroup,
            attributeName: attribute.name,
            field,
            value: value ? parseInt(value) : 0,
        });
    };

    return (<SpendableRow handleChange={handleChange} state={state}></SpendableRow>);
}

export default Attribute;
