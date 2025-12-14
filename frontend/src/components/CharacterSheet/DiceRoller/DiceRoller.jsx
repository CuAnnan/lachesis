import {useState, memo} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {DiceRoll} from "@CharacterModel/DiceRoll.js"
import {Form} from "react-bootstrap";


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
    const [result, setResult] = useState({});
    const [difficulty, setDifficulty] = useState(6);
    const [willpower, setWillpower] = useState(false);
    const [wyrdInvoked, setWyrdInvoked] = useState(false);
    const [specialty, setSpecialty] = useState(false);

    const pool = sheet.getPool(traits);

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
        <Row className="align-items-center">
            <Form.Label htmlFor="willpower" column lg={4}>
                <strong>Willpower:</strong>
            </Form.Label>
            <Col md={1} xlg={1}>
                <Form.Check
                    id="willpower"
                    placeholder="Jane Doe"
                    onChange={(e)=>setWillpower(e.target.checked)}
                />
            </Col>
        </Row>
        <Row className="align-items-center">
            <Form.Label htmlFor="spec" column lg={4}>
                <strong>Specialty:</strong>
            </Form.Label>
            <Col className="text-start">
                <Form.Check
                    id="spec"
                    onChange={(e)=>setSpecialty(e.target.checked)}
                />
            </Col>
        </Row>
        <Row className="align-items-center">
            <Form.Label htmlFor="difficulty" column lg={4}>
                <strong>Difficulty:</strong>
            </Form.Label>
            <Col md={2} xlg={1}>
                <Form.Control
                    id="difficulty"
                    type="number"
                    value={difficulty}
                    onChange={(e)=>setDifficulty(parseInt(e.target.value))}
                />
            </Col>
        </Row>
        <Row className="align-items-center">
            <Form.Label htmlFor="wyrd" column lg={4}>
                <strong>Wyrd invoked:</strong>
            </Form.Label>
            <Col className="text-start">
                <Form.Check
                    id="wyrd"
                    onChange={(e)=>setWyrdInvoked(e.target.checked)}
                />
            </Col>
        </Row>
        <Row>
            <Button variant="primary" onClick={
                () => {
                    const diceRoll = new DiceRoll({traits, dicePool:pool.dicePool, diff:difficulty, wyrd:wyrdInvoked, willpower, specialty});
                    setResult(diceRoll.resolve());
                    console.log(diceRoll.resolve());
                }
            }>Roll</Button>
        </Row>
        {result.dice && <>
            <Row>
                <Col className="text-center">
                    <strong>Results:</strong>
                </Col>
            </Row>
            <Row>
                <Col md={2}><strong>Dice:</strong></Col>
                <Col>{[...result.faces].sort((a, b)=> a - b).map((face, i)=> {
                        let showFace = face === 10 && specialty? face + "*" : face;
                        return <span key={i}>{i > 0 && ', '}{face >= difficulty ? <em><b>{showFace}</b></em> : showFace}</span>
                    }
                )}</Col>
            </Row>
            {result.successes > 0 &&
                <Row>
                    <Col md={2}><strong>Successes:</strong></Col>
                    <Col>{result.successes}</Col>
                </Row>}
            {result.botch &&
                <Row>
                    <Col><strong>Botch!</strong></Col>
                </Row>}
        </>}
    </>;
}

export default memo(DiceRoller);