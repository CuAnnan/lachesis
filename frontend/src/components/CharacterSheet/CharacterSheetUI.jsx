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
import KithAndHouseBoons from "./KithAndHouseBoons.jsx";
import Arts from "./Arts.jsx";

import DiceRoller from "./DiceRoller/DiceRoller.jsx";


import './CharacterSheet.css';


function CharacterSheetUI()
{
    const {nanoid} = useParams();
    const [sheet, setSheet] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [arts, setArts] = useState([]);
    const [house, setHouse] = useState('');
    const [kith, setKith] = useState('');

    const [selectedTraits, setSelectedTraits] = useState({});

    const keyFor = (useGroupName, traitIdOrName) => `${useGroupName}:${traitIdOrName}`;
    const isTraitSelected = (useGroupName, traitIdOrName) => selectedTraits[keyFor(useGroupName, traitIdOrName)] || false;
    const toggleTrait = (useGroupName, traitIdOrName) => {
        const key = keyFor(useGroupName, traitIdOrName);
        setSelectedTraits(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };



    useEffect(()=>{
        let mounted = true;
        setLoading(true);
        setError(null);

        client.get(`/sheets/fetch/${nanoid || ''}`)
            .then(async res=> {
                const {sheet, arts, kith, house} = res.data;
                setArts(arts);
                setHouse(house);
                setKith(kith);
                const loaded = await KithainSheet.fromJSON(sheet);
                // Assign stable ids to every trait instance so duplicates can be selected independently
                let counter = 1;
                const st = loaded.structuredTraits || {};
                for(const category of Object.values(st)){
                    for(const key of Object.keys(category)){
                        const entry = category[key];
                        if(Array.isArray(entry)){
                            for(const t of entry){ if(!t.id) t.id = `t${counter++}`; }
                        }
                        else if(entry && !entry.id){ entry.id = `t${counter++}`; }
                    }
                }
                // Reset selection when loading a new sheet
                setSelectedTraits({});
                setSheet(loaded);
             }).catch(err=> {
                 console.log(err);
                 if(!mounted) return;
                 setError(err?.message || 'Unknown error');
                 setSheet(null);
         }).finally(()=>{
             if(!mounted) return;
             setLoading(false);
         })
     },[nanoid]);

    if(loading) return <Container>Loading...</Container>;
    if(error){
        return <Container>Error: {error}</Container>;
    }

    return <Container fluid><Row>
        <Col>
            <DiceRoller
                sheet={sheet}
                selectedTraits={selectedTraits}
            />
        </Col>
        <Col md={12} lg={7}>
            <Tabs defaultActiveKey="character" id="uncontrolled-tab-example">
                <Tab eventKey="character" title="Character">
                    <CharacterSheetStructure
                        nanoid={nanoid}
                        sheet={sheet}
                        isTraitSelected={isTraitSelected}
                        toggleTrait={toggleTrait}
                    />
                </Tab>
                <Tab eventKey="kithAndHouseBonuses" title="Kith and House">
                    <KithAndHouseBoons
                        kith={kith}
                        house={house}
                        />
                </Tab>
                <Tab eventKey="arts" title="Arts">
                    <Arts arts={arts} />
                </Tab>
            </Tabs>
        </Col>
        <Col>
        </Col>
    </Row></Container>;
}

export default CharacterSheetUI;