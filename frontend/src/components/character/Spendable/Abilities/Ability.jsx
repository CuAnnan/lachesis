import React from 'react';
import SpendableRow from '../SpendableRow.jsx'
import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:2,
    FP:2,
    FIRST_LEVEL:3
};

function Ability({ ability, useGroup, setAbility, collapsed })
{
    const reducer = (state, action)=>
    {
       return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL);
    }
    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:ability});
    }, [ability]);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value,
        });
        setAbility(useGroup, ability.name, field, value);
    };

    return (<SpendableRow collapsed={collapsed} handleChange={handleChange} state={state}></SpendableRow>);
}

export default Ability;
