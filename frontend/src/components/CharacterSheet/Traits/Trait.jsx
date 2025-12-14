import Col from "react-bootstrap/Col";
import TraitDots from "./TraitDots.jsx";
import Row from "react-bootstrap/Row";
import {memo} from "react";

function Trait({trait, isTraitSelected, toggleTrait})
{
    const classNames = `traitName${ isTraitSelected?" selected" : ""}`;

    return <Row>
        <Col
            className={classNames}
            title={trait.specialty?trait.specialty:""}
            onClick={toggleTrait}>
            {trait.name+(trait.specialty?` (${trait.specialty})`:"")}
        </Col>
        <Col className="text-end"><TraitDots level={trait.level}/></Col>
    </Row>
}

export default memo(Trait);