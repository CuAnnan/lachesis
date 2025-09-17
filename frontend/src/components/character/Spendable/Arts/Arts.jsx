import Art from "./Art.jsx";
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";

function Arts({arts, setArt})
{
    return <CollapsibleGroupWithSummary
        startCollapsed={true}
        title="Arts"
        className="artsUseGroup"
        items={arts}
        ItemComponent={Art}
        itemProps={(art) => ({art, setArt })}/>;
}

export default Arts;