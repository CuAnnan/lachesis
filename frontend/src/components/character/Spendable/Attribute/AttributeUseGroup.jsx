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
                setAttributes={setAttributes} // Pass dispatch to Attribute
            />
        );
    }

    return (
        <Col>
            <h2 as={Row}>{useGroup}</h2>
            {attributeRows}
        </Col>
    );
}

export default AttributeUseGroup;
