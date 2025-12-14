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

    // Initialize reducer with the incoming art to avoid an empty flash
    const [state, dispatch] = React.useReducer(reducer, art || {});

    // Reload reducer state whenever the art prop changes
    React.useEffect(()=>{
        dispatch({type:'load', payload:art});
    },[art]);

    const handleChange = (field, value)=>{
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value ? parseInt(value) : 0,
        });

        // Pass the stable id when present so reducers can target the exact art instance; fall back to name.
        setArt(art.id ?? art.name, field, value);
    };

    return (<SpendableRow state={state} handleChange={handleChange} collapsed={collapsed} />);
}

export default Art;