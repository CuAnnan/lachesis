import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SpendableModal({type, state, handleChange})
{
    return <Modal>
        <Modal.Header closeButton>{type}</Modal.Header>
        <Modal.Body>
            <Row>
                <Row className="purchasable d-flex justify-content-center align-items-center">
                    <Col>
                        <Form.Control
                            type="text"
                            value={state.name?state.name:""}
                            onChange={e => handleChange('name', e.target.value)}
                        />
                    </Col>
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
                    <Col sm={1}>{state.xpToLevel?state.xpToLevel:4}</Col>
                    <Col sm={1}>{state.level?state.level:0}</Col>
                </Row>
            </Row>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
    </Modal>
}

export default SpendableModal;