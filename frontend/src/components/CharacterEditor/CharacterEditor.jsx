import {useReducer, useEffect, useMemo} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AttributeUseGroup from './Spendable/Attributes/AttributeUseGroup.jsx';
import AbilityUseGroup from "./Spendable/Abilities/AbilityUseGroup.jsx";
import Arts from './Spendable/Arts/Arts.jsx';
import Realms from './Spendable/Realms/Realms.jsx';
import { useParams } from "react-router-dom";
import {client} from "@inc/AxiosInterceptor.js";
import Instructions from './Instructions.jsx';
import Summary from './Summary.jsx';
import Tempers from './Spendable/Temper/Tempers.jsx';

import './Character.css';
import CharacterDetails from "./CharacterDetails/CharacterDetails.jsx";
import {CharacterDispatchers} from "./CharacterDispatchers.js";



import {reducer, attributeMap, flattenSheet, blankSheet} from "./CharacterReducer.js";
import BMFSection from "./Spendable/BMFModal/BMFSection.jsx";
import useAutosave from "./useAutosave.js";
import { parseServerSheet } from "./sheetUtils.js";


function getTotalSummary(state) {
    const allSpendables = [
        ...Object.values(state.attributes ?? {}).flatMap(g => g),
        ...Object.values(state.abilities ?? {}).flatMap(g => g),
        ...(state.arts ?? []),
        ...(state.realms ?? []),
        ...(state.backgrounds ?? []),
        ...(state.merits ?? []),
        ...(state.flaws ?? []),
        ...(state.tempers ? Object.values(state.tempers):[]),
    ];
    return allSpendables.reduce(
        (totals, item) => ({
            fp: totals.fp + (item.fp || 0),
            xp: totals.xp + (item.xp || 0),
        }),
        { cp: 0, fp: 0, xp: 0 }
    );
}


function CharacterEditor()
{
    const {nanoid} = useParams();
    const initialState = blankSheet();
    const [state, dispatch] = useReducer(reducer, initialState);
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
        updateTemper,
    } = CharacterDispatchers(dispatch);

    // Fetch and parse server sheet using helper
    useEffect(()=>{
        client.get(`/sheets/fetch/${nanoid || ''}`)
            .then(res=>{
                const {sheet: json} = res.data;
                const data = parseServerSheet(json, { getNextBackgroundId, getNextMeritId, getNextFlawId, attributeMap });
                dispatch({'type':'loadData', payload:data});
            }).catch(error=>{
                console.error(error);
            });

    },[nanoid, getNextFlawId, getNextBackgroundId, getNextMeritId]);

    // Use autosave hook to keep autosave logic out of the component
    useAutosave({
        // pass a minimal shape the hook expects: the reducer keeps the canonical shape
        ...state,
        sheet: flattenSheet(state),
        loading: state.loading,
        hasChanges: state.hasChanges,
      }, nanoid, dispatch, { debounceMs: 800 });

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

    return (
        state && (
        <Container fluid>
            <Row>
                <Col lg={12} xl={2}>
                    <Instructions/>
                    <Summary totalSummary={totalSummary}/>

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
                        <Col className="useGroup">
                            <Row>
                                <BMFSection
                                    title="Background"
                                    alreadyPurchased={state.backgrounds}
                                    updateField={updateBackground}
                                    addNew={addBackground}
                                    handleDelete={deleteBackground}
                                />
                            </Row>
                            <Row>
                                <BMFSection
                                    title="Merit"
                                    alreadyPurchased={state.merits}
                                    updateField={updateMerit}
                                    addNew={addMerit}
                                    handleDelete={deleteMerit}
                                    />
                            </Row>
                            <Row>
                                <BMFSection
                                    title="Flaw"
                                    alreadyPurchased={state.flaws}
                                    updateField={updateFlaw}
                                    addNew={addFlaw}
                                    handleDelete={deleteFlaw}
                                />
                            </Row>
                        </Col>
                        <Col className="useGroup">
                            <Row>
                                <Tempers tempers={state.tempers} setTemper={updateTemper} />
                            </Row>
                            <Row>
                                <Arts arts={state.arts} setArt={updateArt} />
                            </Row>
                        </Col>
                        <Realms realms={state.realms} setRealm={updateRealm} />
                    </Row>
                </Col>
            </Row>
        </Container>
    ));
}

export default CharacterEditor;
