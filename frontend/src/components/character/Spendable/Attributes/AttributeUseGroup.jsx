import CollapsibleGroup from "../CollapsibleGroup.jsx";
import Attribute from "./Attribute.jsx";

function AttributeUseGroup({ useGroup, attributes, setAttribute })
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
                        setAttribute={setAttribute}
                    />
                )))
            }/>
    );
}

export default AttributeUseGroup;
