import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip';
import {useState} from "react";

import './SpendableRow.css';

function SpendableRow({state, handleChange, collapsed})
{
    const [editingSpecialty, setEditingSpecialty] = useState(false);
    const [specialtyValue, setSpecialtyValue] = useState(state.specialty || "");

    const updateSpecialty = () => {
        setEditingSpecialty(false);
        handleChange('specialty', specialtyValue);
    }


    let stateNameColumn = editingSpecialty?(
        <Col className="stateName">
            {state.name}
            <Form.Control
                autoFocus
                type="text"
                value={specialtyValue}
                onChange={e => setSpecialtyValue(e.target.value)}
                onBlur={() => {
                    updateSpecialty();
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        updateSpecialty();
                    }
                }}
            />
        </Col>
    ):(state.specialty?
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tt-${state.id}`}>{state.specialty}</Tooltip>}
        >
            <Col className="stateName">
                {state.name + (state.specialty?" *":"")}
            </Col>
        </OverlayTrigger>
        :<Col className="stateName">
            {state.name}
        </Col>);


    return ((collapsed&&state.level===0)?<></>:<Row
        className="purchasable d-flex justify-content-center align-items-center"
        onClick={(e)=>{
            if(!(e.shiftKey || e.ctrlKey) && e.detail === 2)
            {
                setEditingSpecialty(true);
            }
            else if (e.shiftKey)
            {
                console.log("Shift click");
            }
            else if(e.ctrlKey)
            {
                console.log("Ctrl click");
            }

        }}
    >
        {stateNameColumn}
        <Col sm={2}>
            <Form.Control
                type="text"
                value={state.cp?state.cp:0}
                onChange={e => handleChange('cp', Number(e.target.value))}
            />
        </Col>
        <Col sm={2}>
            <Form.Control
                type="text"
                value={state.fp?state.fp:0}
                onChange={e => handleChange('fp', Number(e.target.value))}
            />
        </Col>
        <Col sm={2}>
            <Form.Control
                type="text"
                value={state.xp?state.xp:0}
                onChange={e => handleChange('xp', Number(e.target.value))}
            />
        </Col>
        <Col sm={1}>{state.xpToLevel?state.xpToLevel :4}</Col>
        <Col sm={1}>{state.level?state.level:0}</Col>
    </Row>);
}

export default SpendableRow;