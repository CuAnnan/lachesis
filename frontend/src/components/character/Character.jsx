import React, { useReducer,useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AttributeUseGroup from './Spendable/Attributes/AttributeUseGroup.jsx';
import AbilityUseGroup from "./Spendable/Abilities/AbilityUseGroup.jsx";
import Arts from './Spendable/Arts/Arts.jsx';
import Realms from './Spendable/Realms/Realms.jsx';
import { useParams } from "react-router-dom";
import {client} from "../../AxiosInterceptor.js";

import './Character.css';

function reducer(state, action)
{
    let newState;
    switch (action.type) {
        case 'loadData':
            return action.payload;
        case 'updateAttribute':
            newState =  {
                ...state,
                attributes: {
                    ...state.attributes,
                    [action.useGroup]: state.attributes[action.useGroup].map(attribute =>
                        attribute.name === action.attributeName
                            ? { ...attribute, [action.field]: action.value }
                            : attribute
                    ),
                },
            };
            return newState;
        case 'updateAbility':
            newState = {
                ...state,
                abilities:{
                    ...state.abilities,
                    [action.useGroup]:state.abilities[action.useGroup].map(skill=>
                        skill.name === action.abilityName
                            ? { ...skill, [action.field]: action.value }
                            : skill
                    )
                }
            };
            return newState;
        case 'updateArt':
            newState = {
                ...state,
                arts:state.arts.map(art=>art.name === action.art ? {...art, [action.field]: action.value } : art),
            };
            return newState;
        case 'updateRealm':
            newState = {
                ...state,
                realms:state.realms.map(realm=> realm.name === action.realm ? {...realm, [action.field]: action.value } : realm),
            };
            return newState;
        default:
            return state;
    }
}

function Character()
{
    const {nanoid} = useParams();
    const initialState = {
        'attributes':{
            'Physical':[],
            'Social':[],
            'Mental':[]
        },
        'abilities':{
            'Talent':[],
            'Skill':[],
            'Knowledge':[]
        },
        'arts':[],
        'realms':[],
        'merits':[],
        'flaws':[],
        'backgrounds':[]
    };
    const [state, dispatch] = useReducer(reducer, initialState);


    useEffect(()=>{
        const attributeMap = {
            'Strength':'Physical', 'Dexterity':'Physical', 'Stamina':'Physical',
            'Charisma':'Social', 'Manipulation':'Social', 'Appearance':'Social',
            'Intelligence':'Mental', 'Wits':'Mental', 'Perception':'Mental'
        };


        client.get(`http://localhost:3000/sheets/fetch/${nanoid || ''}`)
            .then(res=>{
                let json = res.data;
                const data = {
                    'attributes':{
                        'Physical':[],
                        'Social':[],
                        'Mental':[]
                    },
                    'abilities':{
                        'Talent':[],
                        'Skill':[],
                        'Knowledge':[]
                    },
                    'arts':[],
                    'realms':[],
                    'merits':[],
                    'flaws':[],
                    'backgrounds':[]
                };
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
            });

    },[nanoid]);

    const attributeCols = [];
    for (const [useGroup, attributes] of Object.entries(state.attributes))
    {
        attributeCols.push(
            <AttributeUseGroup
                key={useGroup}
                useGroup={useGroup}
                attributes={attributes}
                setAttributes={dispatch}
            />
        );
    }

    const abilityCols = [];
    for(const [useGroup, abilities] of Object.entries(state.abilities))
    {
        abilityCols.push(
            <AbilityUseGroup
                key={useGroup}
                useGroup={useGroup}
                abilities={abilities}
                setAbilities={dispatch}
            />
        );
    }

    const updateArt = (art, field, value)=>{
        dispatch({
            type:'updateArt',
            art,
            field,
            value,
        })
    }

    const updateRealm = (realm, field, value)=>{
        dispatch({
            type:'updateRealm',
            realm,
            field,
            value
        });
    }


    return (
        <Container>
            <h1 className="text-center">Attributes</h1>
            <Row>{attributeCols}</Row>
            <h1 className="text-center">Abilities</h1>
            <Row>{abilityCols}</Row>
            <h1 className="text-center">Advantages</h1>
            <Row>
                <Col>
                    <h2 className="text-center">Backgrounds</h2>
                </Col>
                <Arts arts={state.arts} setArt={updateArt} />
                <Realms realms={state.realms} setRealm={updateRealm} />
            </Row>
        </Container>
    );
}

export default Character;
