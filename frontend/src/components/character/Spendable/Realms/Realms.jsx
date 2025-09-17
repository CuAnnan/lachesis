import Realm from './Realm.jsx';
import CollapsibleGroupWithSummary from "../CollapsibleGroupWithSummary.jsx";

function Realms({realms, setRealm})
{
    return (
        <CollapsibleGroupWithSummary
            title="Realms"
            className="realmsUseGroup"
            items={realms}
            ItemComponent={Realm}
            itemProps={(realm) => ({realm, setRealm })}
            />
    );
}

export default Realms;