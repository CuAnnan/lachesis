import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AttributeUseGroup from "./Spendable/Attribute/AttributeUseGroup.jsx";

function reducer(state, action)
{
    switch(action.type)
    {
        case 'UPDATE_ATTRIBUTE':
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    [action.useGroup]:state.attributes[action.useGroup].map((attribute) => {
                        attribute.name === action.attributeName
                            ? {...attribute, [action.field]:action.value}
                            : attribute
                    }),
                }
            };
        default:
            return state;
    }
}

function Character()
{
    const defaultState = {
        attributes:{
            Physical:[
                {name:'Strength',cp:0,fp:0,xp:0, level:0},
                {name:'Dexterity',cp:0,fp:0,xp:0, level:0},
                {name:'Stamina',cp:0,fp:0,xp:0, level:0},
            ],
            Social:[
                {name:'Charisma', cp:0, fp:0,xp:0, level:0},
                {name:'Manipulation', cp:0, fp:0,xp:0, level:0},
                {name:'Appearance', cp:0, fp:0,xp:0, level:0},
            ],
            Mental:[
                {name:'Intelligence', cp:0, fp:0,xp:0, level:0},
                {name:'Wits',cp:0, fp:0,xp:0, level:0},
                {name:'Perception', cp:0, fp:0,xp:0, level:0},
            ]
        }
    };

    const [state, dispatch] = React.useReducer(reducer, defaultState);

    const attributeCols = [];
    for(const [useGroup, attributes] of Object.entries(defaultState.attributes))
    {
        attributeCols.push(<AttributeUseGroup key={useGroup} useGroup={useGroup} attributes={attributes} setAttributes={dispatch}/>);
    }

    return <Container>
        <h1>Attributes</h1>
        <Row>
            {attributeCols}
        </Row>
    </Container>
}

export default Character;