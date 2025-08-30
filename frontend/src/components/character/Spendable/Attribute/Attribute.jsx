import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Col } from 'react-bootstrap';

function Attribute({ attribute, useGroup, setAttributes }) {
    function reducer(state, action) {
        let newState;
        switch (action.type) {
            case 'setFP':
                newState = { ...state, fp: action.fp };
                break;
            case 'setCP':
                newState = { ...state, cp: action.cp };
                break;
            case 'setXP':
                newState = { ...state, xp: action.xp };
                break;
            default:
                return state;
        }

        // Calculate level and xpToLevel
        let level = 1 + Math.floor(newState.cp + newState.fp / 4);
        let xp = newState.xp;
        while (xp >= level * 4) {
            xp -= level * 4;
            level++;
        }

        newState.level = level;
        newState.xpToLevel = level * 4;
        return newState;
    }

    const [state, dispatch] = React.useReducer(reducer, attribute);

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

    return (
        <Row>
            <Col>{attribute.name}</Col>
            <Col sm={2}>
                <Form.Control
                    type="text"
                    value={state.cp?state.cp:0}
                    onChange={e => handleChange('cp', e.target.value)}
                />
            </Col>
            <Col sm={2}>
                <Form.Control
                    type="text"
                    value={state.fp?state.fp:0}
                    onChange={e => handleChange('fp', e.target.value)}
                />
            </Col>
            <Col sm={2}>
                <Form.Control
                    type="text"
                    value={state.xp?state.xp:0}
                    onChange={e => handleChange('xp', e.target.value)}
                />
            </Col>
            <Col sm={2}>{state.level?state.level:0}</Col>
        </Row>
    );
}

export default Attribute;
