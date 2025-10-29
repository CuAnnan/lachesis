import {useState} from "react";
import SpendableHeaderCol from "./SpendableHeaderCol.jsx";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function summary(items)
{
    return items.reduce(
        (totals, item) => ({
            cp: totals.cp + (item.cp || 0),
            fp: totals.fp + (item.fp || 0),
            xp: totals.xp + (item.xp || 0),
        }),
        { cp: 0, fp: 0, xp: 0 }
    );
}

function CollapsibleGroupWithSummary({title, items, itemProps, ItemComponent, startCollapsed, nonCollapsible, useGroup})
{
    const [collapsed, setCollapsed] = useState(startCollapsed);
    const totals = summary(items);
    return (
        <Col className={`useGroup`} id={`group-${title.replace(/\s+/g, "-").toLowerCase()}`}>
            <SpendableHeaderCol title={title} collapsed={collapsed} setCollapsed={setCollapsed} nonCollapsible={nonCollapsible} />
            {items.map((item, index) => (
                <ItemComponent
                    key={index}
                    {...item}
                    {...itemProps(item, collapsed)}
                    collapsed={collapsed}
                    {...(useGroup !== undefined ? { useGroup } : {})}
                />

            ))}
            <Row className="purchasable d-flex justify-content-center align-items-center">
                <Col>Summary:</Col>
                <Col sm={2} className="text-center">{totals.cp}</Col>
                <Col sm={2} className="text-center">{totals.fp}</Col>
                <Col sm={2} className="text-center">{totals.xp}</Col>
                <Col sm={1}>&nbsp;</Col>
                <Col sm={1}>&nbsp;</Col>
            </Row>
        </Col>
    );
}

export default CollapsibleGroupWithSummary;