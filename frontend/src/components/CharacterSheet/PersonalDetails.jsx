import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {memo} from "react";

function PersonalDetails({sheet})
{
    return <>
        <h2>Personal Details</h2>
        <Row id="personalDetails">
            <Col>
                <Row>
                    <Col><strong>Name</strong></Col>
                    <Col>{sheet.name}</Col>
                </Row>
                <Row>
                    <Col><strong>Player</strong></Col>
                    <Col>{sheet.player}</Col>
                </Row>
                <Row>
                    <Col><strong>Chronicle</strong></Col>
                    <Col>{sheet.chronicle}</Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col><strong>Court</strong></Col>
                    <Col>{sheet.court}</Col>
                </Row>
                <Row>
                    <Col><strong>Legacies</strong></Col>
                    <Col>{sheet.legacies.seelie} / {sheet.legacies.unseelie}</Col>
                </Row>
                <Row>
                    <Col><strong>House</strong></Col>
                    <Col>{sheet.house}</Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col><strong>Seeming</strong></Col>
                    <Col>{sheet.seeming}</Col>
                </Row>
                <Row>
                    <Col><strong>Kith</strong></Col>
                    <Col>{sheet.kith}</Col>
                </Row>
                <Row>
                    <Col><strong>Motley</strong></Col>
                    <Col>{sheet.motley}</Col>
                </Row>
            </Col>

        </Row>
    </>
}


export default memo(PersonalDetails);