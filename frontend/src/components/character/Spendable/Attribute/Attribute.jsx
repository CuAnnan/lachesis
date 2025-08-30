import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {Col} from "react-bootstrap";

function Attribute({attribute, setAttribute})
{
    function reducer(state, action)
    {
        let newState;
        switch(action.type)
        {
            case 'setFP':
                newState = {...state, fp: action.fp};
                break;
            case 'setCP':
                newState = {...state, cp: action.cp};
                break;
            case 'setXP':
                newState = {...state, xp: action.xp};
                break;
        }
        let level = 1 + newState.cp + newState.fp / 4;
        let xp = newState.xp;
        while(xp >= level * 4)
        {
            xp -= level * 4;
            level ++;
        }
        newState.level = level;
        newState.xpToLevel = level * 4;
        return newState;
    }

    const [state, dispatch] = React.useReducer(reducer, attribute)  ;

    return <Row>
        <Col>{attribute.name}</Col>
        <Col sm={2}>
            <Form.Control
                type="text"
                value={state.cp}
                onChange={e=>{
                    dispatch({
                        type:'setCP',
                        cp: e.target.value?parseInt(e.target.value):0,
                    });
                }}
            />
        </Col>
        <Col sm={2}>
            <Form.Control
                type="text"
                value={state.fp}
                onChange={e=>{
                    dispatch({
                        type:'setFP',
                        fp: e.target.value?parseInt(e.target.value):0,
                    });
                }}
            />
        </Col>
        <Col sm={2}>
            <Form.Control
                type="text"
                value={state.xp}
                onChange={e=>{
                    dispatch({
                        type:'setXP',
                        xp:  e.target.value?parseInt(e.target.value):0,
                    });
                }}
            />
        </Col>
        <Col sm={2}>
            {state.level}
        </Col>
    </Row>
}

export default Attribute;