import React from 'react';
import Col from 'react-bootstrap/Col';
import Realm from './Realm.jsx';

function Realms({realms, setRealm})
{
    const realmRows = realms.map((realm, i) => {
       return <Realm key={i} realm={realm} setRealm={setRealm} />;
    });
    return <Col>
        <h2 className="text-center">Realms</h2>
        {realmRows}
    </Col>
}

export default Realms;