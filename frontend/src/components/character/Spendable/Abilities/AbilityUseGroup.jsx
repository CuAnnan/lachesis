import Ability from './Ability.jsx';
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";

function AbilityUseGroup({ useGroup, abilities, setAbility })
{
    return (
        <CollapsibleGroupWithSummary
            title={useGroup}
            className="abiilityUseGroup"
            items={abilities}
            ItemComponent={Ability}
            itemProps={(ability) => ({ability, setAbility })}
        />
    );
}

export default AbilityUseGroup;
