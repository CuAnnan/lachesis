import Art from "./Art.jsx";
import CollapsibleGroup from "../CollapsibleGroup.jsx";

function Arts({arts, setArt})
{
    return (
        <CollapsibleGroup
            title="Arts"
            className="artsUseGroup"
            startCollapsed={true}
            renderItems={(collapsed)=> (
                arts.map((art) => (
                    <Art
                        key={art.name}
                        art={art}
                        collapsed={collapsed}
                        setArt={setArt} />
                ))
            )}/>
    );
}

export default Arts;