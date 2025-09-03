import React from 'react';
import SpendableRow from '../SpendableRow.jsx';
import SpendableReducer from "../SpendableReducer.js";

function Art({art, setArt})
{
    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, 4, 5, 7);
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

    return (<SpendableRow state={state} handleChange={handleChange}/>);
}

export default Art;