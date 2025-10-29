import React, {useEffect, useState} from 'react';
import KithainSheet from "@CharacterModel/KithainSheet.js";
import {useParams} from "react-router-dom";
import {client} from "@inc/AxiosInterceptor.js";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from "react-bootstrap/Container";

import CharacterSheetStructure from "./CharacterSheetStructure.jsx";
import DiceRoller from "./DiceRoller/DiceRoller.jsx";


import './CharacterSheet.css';


function CharacterSheetUI()
{
    const {nanoid} = useParams();
    const [sheet, setSheet] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [selectedTraits, setSelectedTraits] = useState({});

    const keyFor = (useGroupName, traitName) => `${useGroupName}:${traitName}`;
    const isTraitSelected = (useGroupName, traitName) => selectedTraits[keyFor(useGroupName, traitName)] || false;
    const toggleTrait = (useGroupName, traitName) => {
        setSelectedTraits(prevState => ({
            ...prevState,
            [keyFor(useGroupName, traitName)]: !isTraitSelected(useGroupName, traitName)
        }));
    };



    useEffect(()=>{
        let mounted = true;
        setLoading(true);
        setError(null);

        client.get(`/sheets/fetch/${nanoid || ''}`)
            .then(async res=> {
                setSheet(
                    await KithainSheet.fromJSON(res.data)
                );
            }).catch(err=> {
                if(!mounted) return;
                setError(err?.message || 'Unknown error');
                setSheet(null);
        }).finally(()=>{
            if(!mounted) return;
            setLoading(false);
        })
    },[nanoid]);

    if(loading) return <Container>Loading...</Container>;
    if(error) return <Container>Error: {error}</Container>;

    console.log(sheet);

    return <Container fluid><Row>
        <Col></Col>
        <Col md={7}>
            <Tabs defaultActiveKey="character" id="uncontrolled-tab-example">
                <Tab eventKey="character" title="Character">
                    <CharacterSheetStructure
                        nanoid={nanoid}
                        sheet={sheet}
                        isTraitSelected={isTraitSelected}
                        toggleTrait={toggleTrait}
                    />
                </Tab>
                <Tab eventKey="kithAndHouseBonuses" title="Kith and House"></Tab>
                <Tab eventKey="arts" title="Arts"></Tab>
            </Tabs>
        </Col>
        <Col>
            <DiceRoller
                sheet={sheet}
                selectedTraits={selectedTraits}
            />
        </Col>
    </Row></Container>;
}

export default CharacterSheetUI;