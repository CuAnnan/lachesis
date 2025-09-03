import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Attribute from './Attribute.jsx';

function AttributeUseGroup({ useGroup, attributes, setAttributes }) {
    const attributeRows = [];

    for (const attribute of attributes) {
        attributeRows.push(
            <Attribute
                key={attribute.name}
                attribute={attribute}
                useGroup={useGroup}
                setAttributes={setAttributes} // Pass dispatch to Attributes
            />
        );
    }

    return (
        <Col className="useGroup attributeUseGroup">
            <Row>
                <h2 className="text-center">{useGroup}</h2>
            </Row>
            <Row className="columnTitles text-center">
                <Col></Col>
                <Col sm={2}>CP</Col>
                <Col sm={2}>FP</Col>
                <Col sm={2}>XP</Col>
                <Col sm={1}>lvl</Col>
                <Col sm={1}>cost</Col>
            </Row>
            {attributeRows}
        </Col>
    );
}

export default AttributeUseGroup;
