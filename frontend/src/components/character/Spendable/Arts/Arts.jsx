import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Art from "./Art.jsx";

function Arts({arts, setArt})
{
    const artRows = [];
    for (const art of arts)
    {
        artRows.push(<Art key={art.name} art={art} setArt={setArt} />);
    }

    return <Col className="useGroup realmUseGroup">
        <Row>
            <h2 className="text-center">Arts</h2>
        </Row>
        {artRows}
    </Col>
}

export default Arts;