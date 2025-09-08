import {useReducer, useEffect, useState, useCallback, useMemo, useRef} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AttributeUseGroup from './Spendable/Attributes/AttributeUseGroup.jsx';
import AbilityUseGroup from "./Spendable/Abilities/AbilityUseGroup.jsx";
import Backgrounds from './Spendable/Backgrounds/Backgrounds.jsx';
import Arts from './Spendable/Arts/Arts.jsx';
import Realms from './Spendable/Realms/Realms.jsx';
import { useParams } from "react-router-dom";
import {client} from "../../AxiosInterceptor.js";

import './Character.css';

function reducer(state, action)
{
    if(action.value)
    {
        action.value = parseInt(action.value);
    }
    switch (action.type) {
        case 'loadData':
            return { ...state, loading: false, error: null, ...action.payload };
        case 'updateAttribute':
            return {
                ...state,
                hasChanges:true,
                attributes: {
                    ...state.attributes,
                    [action.useGroup]: state.attributes[action.useGroup].map(attribute =>
                        attribute.name === action.attributeName
                            ? { ...attribute, [action.field]: action.value }
                            : attribute
                    ),
                },
            };
        case 'updateAbility':
            return {
                ...state,
                hasChanges:true,
                abilities:{
                    ...state.abilities,
                    [action.useGroup]:state.abilities[action.useGroup].map(skill=>
                        skill.name === action.abilityName
                            ? { ...skill, [action.field]: action.value }
                            : skill
                    )
                }
            };
        case 'updateArt':
            return {
                ...state,
                hasChanges:true,
                arts:state.arts.map(art=>art.name === action.art ? {...art, [action.field]: action.value } : art),
            };
        case 'updateRealm':
            return {
                ...state,
                hasChanges:true,
                realms:state.realms.map(realm=> realm.name === action.realm ? {...realm, [action.field]: action.value } : realm),
            };
        case 'resetDirty':
            return {
                ...state,
                hasChanges:false
            }
        case 'addBackground':
            return {
                ...state,
                hasChanges:true,
                backgrounds:[
                    ...state.backgrounds,
                    action.background
                ]
            }
        case "updateBackground":
            return {
                ...state,
                hasChanges:true,
                backgrounds:state.backgrounds.map(background=>background.id === action.backgroundId ? {...background, [action.field]: action.value} : background),
            }
        default:
            return state;
    }
}

const blankSheet = () => ({
    loading: true,
    error: null,
    hasChanges: false,
    attributes: { Physical: [], Social: [], Mental: [] },
    abilities: { Talent: [], Skill: [], Knowledge: [] },
    arts: [],
    realms: [],
    merits: [],
    flaws: [],
    backgrounds: [],
});

const attributeMap = {
    'Strength':'Physical', 'Dexterity':'Physical', 'Stamina':'Physical',
    'Charisma':'Social', 'Manipulation':'Social', 'Appearance':'Social',
    'Intelligence':'Mental', 'Wits':'Mental', 'Perception':'Mental'
};

function flattenSheet(sheet)
{
    return [
        ...Object.values(sheet?.attributes ?? {}).flatMap(g => g),
        ...Object.values(sheet?.abilities ?? {}).flatMap(g => g),
        ...Object.values(sheet?.arts ?? []),
        ...Object.values(sheet?.realms ?? []),
        ...Object.values(sheet?.backgrounds ?? []),
        ...Object.values(sheet?.merits ?? []),
        ...Object.values(sheet?.flaws ?? []),
    ];
}

function Character()
{
    const {nanoid} = useParams();
    const initialState = blankSheet();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [saveRequest, setSaveRequest] = useState(null);
    const backgroundId = useRef(1);


    useEffect(()=>{
        client.get(`/sheets/fetch/${nanoid || ''}`)
            .then(res=>{
                let json = res.data;
                const data = blankSheet();
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
                            trait.id = backgroundId.current++;
                            data.backgrounds.push(trait);
                            break;
                        case 'Merit':
                            data.merits.push(trait);
                            break;
                        case 'Flaw':
                            data.flaws.push(trait);
                            break;
                    }
                }
                dispatch({'type':'loadData', payload:data});
            }).catch(error=>{
                console.error(error);
            });

    },[nanoid]);

    useEffect(() => {
        if (state.loading || saveRequest || !state.hasChanges) return;

        const request = client
            .post('/sheets', { sheet: { traits: flattenSheet(state) } })
            .then(resp => {
                console.log('Saved:', resp.data);
                dispatch({ type: 'resetDirty' });
            })
            .catch(err => console.error('Save error:', err))
            .finally(() => setSaveRequest(null));

        setSaveRequest(request);
    }, [state, saveRequest]);

    const updateArt = useCallback((art, field, value)=>{
        dispatch({type:'updateArt',art,field,value,});
    },[]);

    const updateRealm = useCallback((realm, field, value)=>{
        dispatch({type:'updateRealm',realm,field,value});
    },[]);

    const addBackground = useCallback((background)=>{
        background.id = backgroundId.current++;
        dispatch({type:"addBackground", background});
    }, [])

    const updateBackground = useCallback((backgroundId, field, value)=>{
        dispatch({type:"updateBackground", backgroundId, field, value});
    },[])

    const attributeCols =useMemo(
        () =>
            Object.entries(state.attributes).map(([useGroup, attributes]) => (
                <AttributeUseGroup
                    key={useGroup}
                    useGroup={useGroup}
                    attributes={attributes}
                    setAttributes={dispatch}
                />
            )),
        [state.attributes]
    );

    const abilityCols = useMemo(
        () =>
            Object.entries(state.abilities).map(([useGroup, abilities]) => (
                <AbilityUseGroup
                    key={useGroup}
                    useGroup={useGroup}
                    abilities={abilities}
                    setAbilities={dispatch}
                />
            )),
        [state.abilities]
    );



    return (
        <Container>
            <h1 className="text-center">Attributes</h1>
            <Row>{attributeCols}</Row>
            <h1 className="text-center">Abilities</h1>
            <Row>{abilityCols}</Row>
            <h1 className="text-center">Advantages</h1>
            <Row>
                <Col>
                    <Row><Backgrounds backgrounds={state.backgrounds} setBackground={updateBackground} updateBackground={updateBackground} addBackground={addBackground}/></Row>
                </Col>
                <Arts arts={state.arts} setArt={updateArt} />
                <Realms realms={state.realms} setRealm={updateRealm} />
            </Row>
        </Container>
    );
}

export default Character;
