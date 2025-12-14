import {memo} from "react";
import Trait from "./Trait.jsx";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function ucFirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let __traitIdCounter = 1;

function UseGroup({useGroupName, useGroup, isTraitSelected, toggleTrait, flexible=true})
{
    // Normalize the incoming useGroup to an array of trait objects. The backend/model may expose
    // traits as an array, an object map of key->trait, or an object map of key->array (when duplicates
    // exist). We flatten those shapes so the UI can render every trait individually.
    let traitList = [];
    if(!useGroup)
    {
        traitList = [];
    }
    else if(Array.isArray(useGroup))
    {
        traitList = useGroup;
    }
    else if(typeof useGroup === 'object')
    {
        traitList = Object.values(useGroup).flatMap(v => Array.isArray(v) ? v : [v]).filter(Boolean);
    }

    // Ensure every trait has a stable id for selection; if the model didn't provide one, assign a UI-local id.
    for(let t of traitList){
        if(!t.id){ t.id = `ui-${__traitIdCounter++}`; }
    }

    return <Col className="useGroup" md={12} lg={flexible?4:12}>
        <Row><h3>{ucFirst(useGroupName)}</h3></Row>
        {traitList.map((trait, index) =>
            <Trait
                key={trait.id ? trait.id : `${trait.name}-${trait.specialty??''}-${index}`}
                trait={trait}
                isTraitSelected={isTraitSelected(useGroupName, trait.id ?? trait.name)}
                toggleTrait={(e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    toggleTrait(useGroupName, trait.id ?? trait.name)
                }}
            />
        )}
    </Col>
}

export default memo(UseGroup);