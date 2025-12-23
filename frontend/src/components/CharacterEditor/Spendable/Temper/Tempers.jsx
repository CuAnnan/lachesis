import Col from 'react-bootstrap/Col';
import SpendableHeaderCol from "@CharacterEditor/Spendable/SpendableHeaderCol.jsx";
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";
import Temper from "./Temper.jsx";

function Tempers({tempers, setTemper})
{
    if(!tempers || !tempers.Glamour) return (<></>);

    const items = [];
    if (tempers.Glamour) items.push(tempers.Glamour);
    if (tempers.Willpower) items.push(tempers.Willpower);

    return (
        <CollapsibleGroupWithSummary
            title="Tempers"
            items={items}
            ItemComponent={Temper}
            itemProps={(item) => ({
                temper: item,
                setTemper,
                // determine costs by temper name (Glamour vs Willpower)
                costs: (item.name && item.name.toLowerCase().includes('glamour'))
                    ? { xp: 4, fp: 3, cp: 1 }
                    : { xp: 4, fp: 1, cp: 1 }
            })}
            nonCollapsible={true}
            startCollapsed={false}
        />
    );
}
export default Tempers;