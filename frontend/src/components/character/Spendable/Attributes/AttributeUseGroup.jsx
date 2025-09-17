import Attribute from "./Attribute.jsx";
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";

function AttributeUseGroup({ useGroup, attributes, setAttribute })
{
    /*return (
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
    );*/
    return <CollapsibleGroupWithSummary
        title={useGroup}
        className="attributeUseGroup"
        items={attributes}
        ItemComponent={Attribute}
        itemProps={(attribute) => ({attribute, setAttribute })}
        useGroup={useGroup}
    />
}

export default AttributeUseGroup;
