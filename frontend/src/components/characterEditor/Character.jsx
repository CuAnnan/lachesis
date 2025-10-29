import {useReducer, useEffect, useState, useMemo} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AttributeUseGroup from './Spendable/Attributes/AttributeUseGroup.jsx';
import AbilityUseGroup from "./Spendable/Abilities/AbilityUseGroup.jsx";
import Arts from './Spendable/Arts/Arts.jsx';
import Realms from './Spendable/Realms/Realms.jsx';
import { useParams } from "react-router-dom";
import {client} from "../../AxiosInterceptor.js";
import Instructions from './Instructions.jsx';

import './Character.css';
import CharacterDetails from "./CharacterDetails/CharacterDetails.jsx";
import {CharacterDispatchers} from "./CharacterDispatchers.js";

import {reducer, attributeMap, flattenSheet, blankSheet} from "./CharacterReducer.js";
import BMFSection from "./Spendable/BMFModal/BMFSection.jsx";

function getTotalSummary(state) {
    const allSpendables = [
        ...Object.values(state.attributes ?? {}).flatMap(g => g),
        ...Object.values(state.abilities ?? {}).flatMap(g => g),
        ...(state.arts ?? []),
        ...(state.realms ?? []),
        ...(state.backgrounds ?? []),
        ...(state.merits ?? []),
        ...(state.flaws ?? []),
    ];
    return allSpendables.reduce(
        (totals, item) => ({
            fp: totals.fp + (item.fp || 0),
            xp: totals.xp + (item.xp || 0),
        }),
        { cp: 0, fp: 0, xp: 0 }
    );
}


function Character()
{
    const {nanoid} = useParams();
    const initialState = blankSheet();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [saveRequest, setSaveRequest] = useState(null);
    const {
        updateArt,
        updateRealm,
        setAttribute,
        setAbility,
        getNextBackgroundId,
        addBackground,
        updateBackground,
        getNextMeritId,
        addMerit,
        updateMerit,
        updateCharacterDetail,
        updateLegacy,
        getNextFlawId,
        addFlaw,
        updateFlaw,
        deleteBackground,
        deleteFlaw,
        deleteMerit,
    } = CharacterDispatchers(dispatch);

    useEffect(()=>{
        client.get(`/sheets/fetch/${nanoid || ''}`)
            .then(res=>{
                let json = res.data;
                const data = blankSheet(json);
                delete data.loading;
                delete data.error;

                for(let trait of json.traits)
                {
                    switch(trait.type)
                    {
                        case 'Attribute':
                            data.attributes[attributeMap[trait.name]].push(trait);
                            break;
                        case 'Talent':
                        case 'Skill':
                        case 'Knowledge':
                            data.abilities[trait.type].push(trait);
                            break;
                        case 'Realm':
                            data.realms.push(trait);
                            break;
                        case 'Art':
                            data.arts.push(trait);
                            break;
                        case 'Background':
                            trait.id = getNextBackgroundId();
                            data.backgrounds.push(trait);
                            break;
                        case 'Merit':
                            trait.id = getNextMeritId();
                            data.merits.push(trait);
                            break;
                        case 'Flaw':
                            trait.id = getNextFlawId();
                            data.flaws.push(trait);
                            break;
                    }
                }
                dispatch({'type':'loadData', payload:data});
            }).catch(error=>{
                console.error(error);
            });

    },[nanoid, getNextFlawId, getNextBackgroundId, getNextMeritId]);

    useEffect(() => {
        if (state.loading || saveRequest || !state.hasChanges) return;

        const request = client
            .post('/sheets', { sheet:  flattenSheet(state), nanoid })
            .then(resp => {
                console.log('Saved:', resp.data);
                dispatch({ type: 'resetDirty' });
            })
            .catch(err => console.error('Save error:', err))
            .finally(() => setSaveRequest(null));

        setSaveRequest(request);
    }, [state, saveRequest, nanoid]);

    const attributeCols =useMemo(
        () =>
            Object.entries(state.attributes).map(([useGroup, attributes]) => (
                <AttributeUseGroup
                    key={useGroup}
                    useGroup={useGroup}
                    attributes={attributes}
                    setAttribute={setAttribute}
                />
            )),
        [state.attributes, setAttribute]
    );

    const abilityCols = useMemo(
        () =>
            Object.entries(state.abilities).map(([useGroup, abilities]) => (
                <AbilityUseGroup
                    key={useGroup}
                    useGroup={useGroup}
                    abilities={abilities}
                    setAbility={setAbility}
                />
            )),
        [state.abilities, setAbility]
    );

    const totalSummary = getTotalSummary(state);
    // ...existing code...

    return (
        <Container fluid>
            <Row>
                <Col lg={12} xl={2}>
                    <Instructions/>
                </Col>
                <Col>
                    <h1 className="text-center">Personal Details</h1>
                    <CharacterDetails state={state} updateCharacterDetail={updateCharacterDetail} updateLegacy={updateLegacy}/>
                    <h1 className="text-center">Attributes</h1>
                    <Row>{attributeCols}</Row>
                    <h1 className="text-center">Abilities</h1>
                    <Row>{abilityCols}</Row>
                    <h1 className="text-center">Advantages</h1>
                    <Row>
                        <Col>
                            <Row>
                                <BMFSection
                                    title="Background"
                                    alreadyPurchased={state.backgrounds}
                                    updateField={updateBackground}
                                    addNew={addBackground}
                                    deleteField={deleteBackground}
                                />
                            </Row>
                            <Row>
                                <BMFSection
                                    title="Merit"
                                    alreadyPurchased={state.merits}
                                    updateField={updateMerit}
                                    addNew={addMerit}
                                    deleteField={deleteMerit}
                                    />
                            </Row>
                            <Row>
                                <BMFSection
                                    title="Flaw"
                                    alreadyPurchased={state.flaws}
                                    updateField={updateFlaw}
                                    addNew={addFlaw}
                                    deleteField={deleteFlaw}
                                />
                            </Row>
                        </Col>
                        <Arts arts={state.arts} setArt={updateArt} />
                        <Realms realms={state.realms} setRealm={updateRealm} />
                    </Row>
                </Col>
                <Col lg={12} xl={2}>
                    <Row className="purchasable d-flex justify-content-center align-items-center">
                        <Col><strong>Total Summary:</strong></Col>
                        <Col sm={2} className="text-center">{totalSummary.fp}</Col>
                        <Col sm={2} className="text-center">{totalSummary.xp}</Col>
                        <Col sm={1}>&nbsp;</Col>
                        <Col sm={1}>&nbsp;</Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Character;
