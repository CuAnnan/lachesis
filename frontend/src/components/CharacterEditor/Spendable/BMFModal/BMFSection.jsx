import React from 'react';
import BMFRow from './BMFRow.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import BMFModal from "./BMFModal.jsx";
import reducer from "./BMFReducer.jsx";
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";


function BMFSection({alreadyPurchased, updateField, handleDelete, addNew, title})
{
    const [show, setShow] = React.useState(false);
    const handleClose = ()=>setShow(false);
    const handleOpen = ()=>setShow(true);
    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(()=>{
        dispatch({type:'load', payload:{type:title, name:"",cp:0,xp:0,fp:0}});
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


    const modal =(<BMFModal
        show={show}
        handleClose={handleClose}
        handleChange={handleChange}
        handleNew={handleNew}
        type={title}
        state={state}
    />);

    const itemProps = (item) => ({
        item,
        updateItem: updateField,
        handleDelete: ()=>{
            handleDelete(item.id)
        }
    });

    return (
        <Container className="container-fluid">
            {modal}
            <Row>
                <Col>
                    <CollapsibleGroupWithSummary
                        title={title}
                        className="abilityUseGroup"
                        nonCollapsible={true}
                        ItemComponent={BMFRow}
                        itemProps={itemProps}
                        items={alreadyPurchased}
                    />
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