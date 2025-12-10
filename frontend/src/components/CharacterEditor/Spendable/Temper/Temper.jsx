import React from 'react';
import SpendableRow from '../SpendableRow.jsx'
import SpendableReducer from "../SpendableReducer.js";

function Temper({ temper, setTemper, costs })
{
    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, costs.xp, costs.fp, 0, 4);
    }
    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:temper});
    }, [temper]);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value,
        });
        setTemper(temper.name, field, value);
    };

    return (<SpendableRow handleChange={handleChange} state={state}></SpendableRow>);
}

export default Temper;
