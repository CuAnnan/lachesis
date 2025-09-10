import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function BMFModal({type, state, show, handleChange, handleClose, handleNew})
{
    return <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static" keyboard={false} >
        <Modal.Header closeButton>
            <h2>Add new {type}</h2>
        </Modal.Header>
        <Modal.Body>
            <Row className="purchasable d-flex justify-content-center align-items-center">
                <Col>
                    <Form.Control onChange={e=>handleChange("name", e.target.value)}/>
                </Col>
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
                        onChange={e => handleChange('fp',  Number(e.target.value))}
                    />
                </Col>
                <Col sm={2}>
                    <Form.Control
                        type="text"
                        value={state.xp?state.xp:0}
                        onChange={e => handleChange('xp',  Number(e.target.value))}
                    />
                </Col>
                <Col sm={1}>{state.xpToLevel?state.xpToLevel:4}</Col>
                <Col sm={1}>{state.level?state.level:0}</Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleNew}>
                Add {type}
            </Button>
        </Modal.Footer>
    </Modal>
}

export default BMFModal;