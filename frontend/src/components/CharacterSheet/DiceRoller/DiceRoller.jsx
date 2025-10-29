import {memo} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function DiceRoller({sheet, selectedTraits})
{
    const traits = [];
    for(const [key, selected] of Object.entries(selectedTraits))
    {
        if(selected)
        {
            const [,trait] = key.split(":");
            traits.push(trait.toLowerCase());
        }
    }

    const pool = sheet.getPool(traits);

    console.log(pool);
    if(!pool.dicePool)
        return <></>;

    return <>
        <Row>
            <Col>
                <h2>Dice Roller</h2>
            </Col>
        </Row>
        <Row id="diceRoller">
            <Col md={2} xlg={1}>
                <strong>Pool</strong>
            </Col>
            <Col>
                {pool.traits.join(" + ")}
            </Col>
            <Col md={2} xlg={1}>
                {pool.dicePool}
            </Col>
        </Row>
    </>;
}

export default memo(DiceRoller);