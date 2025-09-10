
import React from 'react';
import CollapsibleGroup from "../CollapsibleGroup.jsx";
import BMFRow from './BMFRow.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import SpendableModal from "./SpendableModal.jsx";
import reducer from "./BMFReducer.jsx";


function BMFSection({alreadyPurchased, updateField, deleteField, addNew, title})
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
        addNew(state);
        setShow(false);
    }


    const modal =(<SpendableModal
        show={show}
        handleClose={handleClose}
        handleChange={handleChange}
        handleNew={handleNew}
        type="Background"
        state={state}
    />);

    const renderBackgrounds = React.useCallback(() => (
        alreadyPurchased.map((bg, i) => (
            <BMFRow
                key={`background-${i}`}
                background={bg}
                updateBackground={updateField}
                deleteBackground={deleteField}
            />
        ))
    ), [alreadyPurchased, updateField, deleteField]);

    return (
        <Container className="container-fluid">
            {modal}
            <Row>
                <Col>
                    <CollapsibleGroup
                        title={title}
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

export default BMFSection;