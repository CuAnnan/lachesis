import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Ability({ ability, useGroup, setAbilities }) {
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
            case 'load':
                newState = action.payload;
                break;
            default:
                newState = state;
                break;
        }

        // Calculate level and xpToLevel
        let level = Math.floor(newState.cp + newState.fp / 2);
        let xp = newState.xp;
        if(level === 0)
        {
            if(xp > 3)
            {
                xp -= 3;
                level ++;
            }
        }
        while (level > 0 && xp >= level * 2) {
            xp -= level * 2;
            level++;
        }

        newState.level = level;
        newState.xpToLevel = level === 0?3:level * 2;
        return newState;
    }

    const [state, dispatch] = React.useReducer(reducer, {});
    React.useEffect(()=>{
        dispatch({type:'load', payload:ability});
    }, []);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value ? parseInt(value) : 0,
        });

        setAbilities({
            type: 'updateAbility',
            useGroup,
            abilityName: ability.name,
            field,
            value: value ? parseInt(value) : 0,
        });
    };

    return (
        <Row className="purchasable  d-flex justify-content-center align-items-center">
            <Col>{ability.name}</Col>
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
            <Col sm={1}>{state.level?state.level:0}</Col>
            <Col sm={1}>{state.xpToLevel?state.xpToLevel:3}</Col>
        </Row>
    );
}

export default Ability;
