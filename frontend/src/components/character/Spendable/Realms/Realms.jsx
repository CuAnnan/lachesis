import Realm from './Realm.jsx';
import CollapsibleGroup from "../CollapsibleGroup.jsx";

function Realms({realms, setRealm})
{
    return (
        <CollapsibleGroup
            title="Realms"
            className="realmsUseGroup"
            renderItems={(collapsed)=> (
                realms.map((realm)=>(
                    <Realm
                        key={realm.name}
                        realm={realm}
                        setRealm={setRealm}
                        collapsed={collapsed}/>
                ))
            )}/>
    );
}

export default Realms;