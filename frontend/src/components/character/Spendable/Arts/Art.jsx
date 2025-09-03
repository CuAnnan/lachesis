import Col from 'react-bootstrap/Col';
import React from 'react';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

function Art({art, setArt})
{
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
                console.log(action.payload);
                newState = action.payload;
                break;
            default:
                return state;
        }

        // Calculate level and xpToLevel
        let level = Math.floor(newState.cp + newState.fp / 5);
        let xp = newState.xp;
        while (xp >= level * 7) {
            xp -= level * 7;
            level++;
        }

        newState.level = level;
        newState.xpToLevel = level * 7;

        return newState;
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

    return (
        <Row className="purchasable d-flex justify-content-center align-items-center">
            <Col>{art.name}</Col>
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
            <Col sm={1}>{state.xpToLevel?state.xpToLevel:4}</Col>
        </Row>
    );
}

export default Art;