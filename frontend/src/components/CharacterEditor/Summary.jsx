import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Summary({totalSummary}) {
    return <>
        <Row className="purchasable d-flex justify-content-center align-items-center"><Col>Summary:</Col></Row>
        <Row className="purchasable d-flex justify-content-center align-items-center">
            <Col className="text-center">FP:</Col>
            <Col className="text-center">XP:</Col>
        </Row>
        <Row className="purchasable d-flex justify-content-center align-items-center">
            <Col className="text-center">{totalSummary.fp}</Col>
            <Col className="text-center">{totalSummary.xp}</Col>
        </Row>
    </>
}
export default Summary;