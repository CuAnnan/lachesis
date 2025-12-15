import {Fragment} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './Arts.css';

function Arts({arts}) {
    return <>
        <h2>Arts</h2>
        {arts.map((art, index)=> {
            if(art.cantrips.length > 0)
            {
                console.log(art);
                return <div className="art" key={index}>
                    <Row><Col><h3>{art.name}</h3></Col></Row>
                    {art.cantrips.map((cantrip, index)=>{
                        return <Row className="cantrip" key={index}>
                                <Col md={2}>{cantrip.name}</Col>
                                <Col>{cantrip.effect}</Col>
                            </Row>

                    })}
                </div>
            }
        })}
    </>
}
export default Arts;