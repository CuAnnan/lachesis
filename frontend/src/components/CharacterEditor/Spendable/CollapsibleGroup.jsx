import {useState} from "react";
import SpendableHeaderCol from "./SpendableHeaderCol.jsx";
import Col from "react-bootstrap/Col";

function CollapsibleGroup({title, type, renderItems, startCollapsed, nonCollapsible})
{
    const [collapsed, setCollapsed] = useState(startCollapsed);
    return (
        <Col className={`useGroup ${type}`} id={`group-${title.replace(/\s+/g, "-").toLowerCase()}`}>
            <SpendableHeaderCol title={title} collapsed={collapsed} setCollapsed={setCollapsed} nonCollapsible={nonCollapsible} />
            {renderItems( collapsed )}
        </Col>
    );
}

export default CollapsibleGroup;