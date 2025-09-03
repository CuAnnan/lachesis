import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Realm from './Realm.jsx';

function Realms({realms, setRealm})
{
    const realmRows = realms.map((realm, i) => {
       return <Realm key={i} realm={realm} setRealm={setRealm} />;
    });
    return <Col className="useGroup realmUseGroup">
        <Row><h2 className="text-center">Realms</h2></Row>
        {realmRows}
    </Col>
}

export default Realms;