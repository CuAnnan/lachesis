import React from 'react';
import SpendableRow from '../SpendableRow.jsx'
import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:4,
    FP:2,
    FIRST_LEVEL:3
};

function Background({background, setBackground, collapsed})
{
    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL);
    }

    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:background});
    }, []);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value ? parseInt(value) : 0,
        });

        setBackground(background.name, field, value);
    };

    return (<SpendableRow handleChange={handleChange} state={state} collapsed={collapsed}/>);
}

export default Background;