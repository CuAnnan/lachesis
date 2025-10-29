import React from 'react';
import SpendableRow from '../SpendableRow.jsx';
import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:4,
    FP:4,
    FIRST_LEVEL:7
};

function Art({art, setArt, collapsed})
{

    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL);
    }

    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:art});
    },[]);

    const handleChange = (field, value)=>{
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value ? parseInt(value) : 0,
        });

        setArt(art.name, field, value);
    };

    return (<SpendableRow state={state} handleChange={handleChange} collapsed={collapsed} />);
}

export default Art;