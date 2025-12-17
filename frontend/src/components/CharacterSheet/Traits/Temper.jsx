import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TraitDots from "@CharacterSheet/Traits/TraitDots.jsx";
import TraitBoxes from "@CharacterSheet/Traits/TraitBoxes.jsx";

function Temper({temper})
{
    console.log(temper);
    return (temper && <>
        <Row><Col><h4>{temper.name}</h4></Col></Row>
        <Row><Col>
            <TraitDots level={temper.level} maxLevel={10}/>
        </Col></Row>
        <Row><Col>
            <TraitBoxes level={temper.level} maxLevel={10}/>
        </Col></Row>
    </>);
}

export default Temper;