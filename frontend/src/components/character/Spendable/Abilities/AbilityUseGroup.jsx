import Ability from './Ability.jsx';
import CollapsibleGroup from "../CollapsibleGroup.jsx";

function AbilityUseGroup({ useGroup, abilities, setAbilities })
{
    return (
        <CollapsibleGroup
            title={useGroup}
            className="abilityUseGroup"
            renderItems={(collapsed)=> (
                abilities.map((ability) => (
                    <Ability
                        key={ability.name}
                        ability={ability}
                        useGroup={useGroup}
                        collapsed={collapsed}
                        setAbilities={setAbilities}
                    />
                )))
            }/>
    );
}

export default AbilityUseGroup;
