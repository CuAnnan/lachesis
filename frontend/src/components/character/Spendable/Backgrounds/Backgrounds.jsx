import React from 'react';
import CollapsibleGroup from "../CollapsibleGroup.jsx";
import Background from './Background.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import SpendableModal from "../SpendableModal.jsx";
import BackgroundCategories from "./BackgroundCategories.js";

import SpendableReducer from "../SpendableReducer.js";

const COSTS = {
    XP:4,
    FP:2,
    FIRST_LEVEL:3
};

const reducer = (state, action)=>
{
    return SpendableReducer(state, action, COSTS.XP, COSTS.FP, COSTS.FIRST_LEVEL);
}


function Backgrounds({backgrounds, updateBackground, deleteBackground, addBackground})
{
    const [show, setShow] = React.useState(false);
    const handleClose = ()=>setShow(false);
    const handleOpen = ()=>setShow(true);


    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:{name:"",cp:0,xp:0,fp:0}});
    }, []);

    const handleChange = (field, value) => {
        dispatch({
            type: `set${field.toUpperCase()}`,
            [field]: value
        });
    };

    const handleNew = ()=>
    {
        addBackground(state);
        setShow(false);
    }


    const modal =(<SpendableModal
        show={show}
        handleClose={handleClose}
        handleChange={handleChange}
        handleNew={handleNew}
        type="Background"
        values={BackgroundCategories}
        state={state}
    />);

    const renderBackgrounds = React.useCallback(() => (
        backgrounds.map((bg, i) => (
            <Background
                key={`background-${i}`}
                background={bg}
                updateBackground={updateBackground}
                deleteBackground={deleteBackground}
            />
        ))
    ), [backgrounds, updateBackground, deleteBackground]);

    return (
        <Container className="container-fluid">
            {modal}
            <Row>
                <Col>
                    <CollapsibleGroup
                        title="Backgrounds"
                        className="abilityUseGroup"
                        nonCollapsible={true}
                        renderItems={renderBackgrounds}/>
                </Col>
            </Row>
            <Row>
                <Col className="text-end">
                    <Button onClick={handleOpen} className="btn-primary">{"\u271A"}</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Backgrounds;