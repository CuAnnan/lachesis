import {useState, memo, useEffect} from "react";
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
            const [,idOrName] = key.split(":");
            let traitName = idOrName;
            // If the idOrName looks like an assigned id (e.g., starts with 't') or doesn't match any trait name,
            // try to resolve it to a trait name by searching the sheet's structuredTraits.
            if(sheet && sheet.structuredTraits)
            {
                let found = null;
                for(const category of Object.values(sheet.structuredTraits)){
                    for(const entry of Object.values(category)){
                        if(Array.isArray(entry)){
                            const match = entry.find(t => t.id === idOrName);
                            if(match){ found = match; break; }
                        }
                        else if(entry && entry.id === idOrName){ found = entry; break; }
                    }
                    if(found) break;
                }
                // If we found a trait by id, keep the id so the Sheet.getPool() method can resolve it
                if(found) traitName = idOrName;
            }
            // Push the raw idOrName (ids preserved), or lowercased name when it's a literal name
            traits.push(traitName);
        }
    }

    const [result, setResult] = useState({});
    // Clear the current roll results whenever selected traits change
    useEffect(() => {
        setResult({});
    }, [selectedTraits]);
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
                    onChange={(e)=>{
                        setResult({});
                        setWillpower(e.target.checked);
                    }}
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
                    onChange={(e)=>{
                        setResult({});
                        setSpecialty(e.target.checked);
                    }}
                />
            </Col>
        </Row>
        <Row className="align-items-center">
            <Form.Label htmlFor="difficulty" column lg={4}>
                <strong>Difficulty:</strong>
            </Form.Label>
            <Col md={2} xlg={1}>
                <Form.Select id={difficulty} value={difficulty} onChange={(e)=>{setResult({}); setDifficulty(parseInt(e.target.value));}}>
                    {[3, 4, 5, 6,7,8,9,10].map((diff)=>
                        <option key={diff} value={diff}>{diff}</option>
                    )}
                </Form.Select>
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