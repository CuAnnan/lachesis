import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Ability from './Ability.jsx';

function AbilityUseGroup({ useGroup, abilities, setAbilities }) {
    const abilityRows = [];

    for (const ability of abilities) {
        abilityRows.push(
            <Ability
                key={ability.name}
                ability={ability}
                useGroup={useGroup}
                setAbilities={setAbilities} // Pass dispatch to Attributes
            />
        );
    }

    return (
        <Col className="useGroup abilityUseGroup">
            <Row>
                <h2 className="text-center">{useGroup}s</h2>
            </Row>
            <Row className="columnTitles text-center">
                <Col></Col>
                <Col sm={2}>CP</Col>
                <Col sm={2}>FP</Col>
                <Col sm={2}>XP</Col>
                <Col sm={1}>lvl</Col>
                <Col sm={1}>cost</Col>
            </Row>
            {abilityRows}
        </Col>
    );
}

export default AbilityUseGroup;
