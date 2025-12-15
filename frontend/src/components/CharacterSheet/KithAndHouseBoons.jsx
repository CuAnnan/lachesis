import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function KithAndHouseBoons({kith, house}) {
    return <>
        {kith &&<>
            <Row>
                <Col className={"text-center"}><h2>Kith and House Boons</h2></Col>
            </Row>
            <Row>
                <Col className={"text-center"}><h3>{kith.name}</h3></Col>
            </Row>
            <Row>
                <Col className={"text-center"}><h4>Birthrights</h4></Col>
            </Row>
            {kith.birthrights.map((birthright, index) => <>
                <Row key={"name"+index}>
                    <Col className={"text-center"}><h5>{birthright.name}</h5></Col>
                </Row>
                <Row key={"mechanics"+index}><Col>{birthright.mechanics}</Col></Row>
            </>)}
            <Row>
                <Col className={"text-center"}><h4>Frailty</h4></Col>
            </Row>
            <Row>
                <Col className={"text-center"}><h5>{kith.frailty.name}</h5></Col>
            </Row>
            <Row>
                <Col>{kith.frailty.mechanics}</Col>
            </Row>
        </>
        }{house && <>
            <Row>
                <Col className={"text-center"}><h3>House {house.name}</h3></Col>
            </Row>
            <Row>
                <Col><strong>Boon:</strong> {house.boon}</Col>
            </Row>
            <Row>
                <Col><strong>Flaw: </strong> {house.flaw}</Col>
            </Row>
        </>}
    </>
}
export default KithAndHouseBoons;