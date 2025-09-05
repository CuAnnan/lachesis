import CollapsibleGroup from "../CollapsibleGroup.jsx";
import Attribute from "./Attribute.jsx";

function AttributeUseGroup({ useGroup, attributes, setAttributes })
{
    return (
        <CollapsibleGroup
            title={useGroup}
            className="attributeUseGroup"
            renderItems={(collapsed)=> (
                attributes.map((attribute) => (
                    <Attribute
                        key={attribute.name}
                        attribute={attribute}
                        useGroup={useGroup}
                        collapsed={collapsed}
                        setAbilities={setAttributes}
                    />
                )))
            }/>
    );
}

export default AttributeUseGroup;
