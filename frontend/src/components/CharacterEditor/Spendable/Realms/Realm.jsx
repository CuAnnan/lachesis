import React from 'react';
import SpendableRow from '../SpendableRow.jsx'
import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:3,
    FP:2,
    FIRST_LEVEL:5
};


function Realm({realm, setRealm, collapsed})
{
    const reducer = (state, action)=>
    {
        return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL);
    }

    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:realm});
    }, []);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value ? parseInt(value) : 0,
        });

        setRealm(realm.name, field, value);
    };

    return (<SpendableRow handleChange={handleChange} state={state} collapsed={collapsed}/>);
}

export default Realm;