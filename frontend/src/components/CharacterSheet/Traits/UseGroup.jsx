import {memo} from "react";
import Trait from "./Trait.jsx";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function ucFirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function UseGroup({useGroupName, useGroup, isTraitSelected, toggleTrait, flexible=true})
{
    return <Col className="useGroup" md={12} lg={flexible?4:12}>
        <Row><h3>{ucFirst(useGroupName)}</h3></Row>
        {Object.values(useGroup).map((trait, index) =>
            <Trait
                key={index}
                trait={trait}
                isTraitSelected={isTraitSelected(useGroupName, trait.name)}
                toggleTrait={()=>toggleTrait(useGroupName, trait.name)}
            />
        )}
    </Col>
}

export default memo(UseGroup);