import Attribute from "./Attribute.jsx";
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";

function AttributeUseGroup({ useGroup, attributes, setAttribute })
{
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
