import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {memo} from "react";

function PersonalDetails({sheet})
{
    return <>
        <h2>Personal Details</h2>
        <Row id="personalDetails">
        <Col md={2} lg={2}><strong>Name</strong></Col>
        <Col md={2} lg={2}>{sheet.name}</Col>
        <Col md={2} lg={2}><strong>Court</strong></Col>
        <Col md={2} lg={2}>{sheet.court}</Col>
        <Col md={2} lg={2}><strong>Seeming</strong></Col>
        <Col md={2} lg={2}>{sheet.seeming}</Col>
        <Col md={2} lg={2}><strong>Player</strong></Col>
        <Col md={2} lg={2}>{sheet.player}</Col>
        <Col md={2} lg={2}><strong>Legacies</strong></Col>
        <Col md={2} lg={2}>{sheet.legacies.seelie} / {sheet.legacies.unseelie}</Col>
        <Col md={2} lg={2}><strong>Kith</strong></Col>
        <Col md={2} lg={2}>{sheet.kith}</Col>
        <Col md={2} lg={2}><strong>Chronicle</strong></Col>
        <Col md={2} lg={2}>{sheet.chronicle}</Col>
        <Col md={2} lg={2}><strong>House</strong></Col>
        <Col md={2} lg={2}>{sheet.house}</Col>
        <Col md={2} lg={2}><strong>Motley</strong></Col>
        <Col md={2} lg={2}>{sheet.motley}</Col>
    </Row></>
}

export default memo(PersonalDetails);