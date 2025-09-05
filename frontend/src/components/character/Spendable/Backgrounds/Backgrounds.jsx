import React from 'react';
import CollapsibleGroup from "../CollapsibleGroup.jsx";
import Background from './Background.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Backgrounds({backgrounds, setBackground, deleteBackground})
{
    return (
        <Container className="container-fluid">
            <Row>
                <Col>
                    <CollapsibleGroup
                        title="Backgrounds"
                        className="abilityUseGroup"
                        nonCollapsible={true}
                        renderItems={()=> (
                            backgrounds.map((background) => (
                                <Background
                                    key={background.name}
                                    background={background}
                                    setBackground={setBackground}
                                    deleteBackground={deleteBackground}
                                />
                            )))
                        }/>
                </Col>
            </Row>
            <Row>
                <Col className="text-end">
                    <Button className="btn-primary">{"\u271A"}</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Backgrounds;