import React, { useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AttributeUseGroup from './Spendable/Attribute/AttributeUseGroup.jsx';

function updateCharacter(character)
{
    console.log(character);
}

function reducer(state, action)
{
    let newState;
    switch (action.type) {
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
            updateCharacter(newState);
            return newState;
        case 'updateSkill':
            newState = {
                ...state,
                abilities:{
                    ...state.abilities,
                    [action.useGroup]:state.abilities[action.useGroup].map(skill=>
                        skill.name === action.skillName
                            ? { ...skill, [action.field]: action.value }
                            : skill
                    )
                }
            };
            updateCharacter(newState);
            return newState;
        default:
            return state;
    }
}

function Character() {
    const defaultState = {
        attributes: {
            Physical: [
                { name: 'Strength'},
                { name: 'Dexterity'},
                { name: 'Stamina'},
            ],
            Social: [
                { name: 'Charisma', cp: 0, fp: 0, xp: 0, level: 0 },
                { name: 'Manipulation', cp: 0, fp: 0, xp: 0, level: 0 },
                { name: 'Appearance', cp: 0, fp: 0, xp: 0, level: 0 },
            ],
            Mental: [
                { name: 'Intelligence', cp: 0, fp: 0, xp: 0, level: 0 },
                { name: 'Wits', cp: 0, fp: 0, xp: 0, level: 0 },
                { name: 'Perception', cp: 0, fp: 0, xp: 0, level: 0 },
            ],
        },
        abilities: {
            Talents:[],
            Skills:[],
            Knowledges:[]
        }
    };

    const [state, dispatch] = useReducer(reducer, defaultState);

    const attributeCols = [];
    for (const [useGroup, attributes] of Object.entries(state.attributes)) {
        attributeCols.push(
            <AttributeUseGroup
                key={useGroup}
                useGroup={useGroup}
                attributes={attributes}
                setAttributes={dispatch} // Pass dispatch to AttributeUseGroup
            />
        );
    }

    return (
        <Container>
            <h1>Attributes</h1>
            <Row>{attributeCols}</Row>
        </Container>
    );
}

export default Character;
