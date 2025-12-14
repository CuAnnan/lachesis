import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";


function Collapser({collapsed})
{
    return <span>{collapsed ? "↑" : "↓"}</span>
}

function SpendableHeaderCol({title, collapsed, setCollapsed, nonCollapsible})
{
    return <>
        <Row>
            <h2 className="text-center"  onClick={(e)=>{setCollapsed(!collapsed);}}>
                {title}
                {!nonCollapsible?<Collapser collapsed={collapsed}/>:''}
            </h2>
        </Row>
        <Row className="columnTitles text-center">
            <Col></Col>
            <Col sm={1}>lvl</Col>
            <Col sm={2}>CP</Col>
            <Col sm={2}>FP</Col>
            <Col sm={2}>XP</Col>
            <Col sm={1}>cost</Col>
        </Row>
    </>;
}

export default SpendableHeaderCol;