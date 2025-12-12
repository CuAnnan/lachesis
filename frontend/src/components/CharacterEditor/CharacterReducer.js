import SpendableReducer from './Spendable/SpendableReducer.js';

/*
 * I've pulled this into its own file because the attribute and skill bonuses from Houses
 * are quiet verbose to implement and I didn't want that code polluting Character.jsx, which is largely a layout file
 */

const updateSpendable = (item, action, field) => {
    const reducerAction = { type: `set${field.toUpperCase()}`, [field]: action.value };
    
    return SpendableReducer(
        { ...item, [field]: action.value },
        reducerAction,
        item.xpCost ?? 4,        // Default xpCost
        item.fpCost ?? 1,        // Default fpCost
        item.firstLevelXPCost ?? 4, // Default firstLevelXPCost
        item.startLevel ?? 0
    );
};


const kithBonuses = {
    'Piskie':
        {type:"attribute", name:'Dexterity', bonus:1},
    'Satyr':
        {type:"attribute", name:'Stamina', bonus:1},
    'Sidhe (Arcadian)':
        {type:"attribute", name: 'Appearance', bonus:2},
    'Sidhe (Autumn)':
        {type:"attribute", name:'Appearance', bonus:2},
    'Troll':
        {type:"attribute", name:'Strength', bonus:1}
};

const houseBonuses = {
    'Beaumayn':[{type:"attribute", name:'Perception', bonus:1}],
    'Leanhaun':[{type:"attribute", name:'Charisma', bonus:1}],
    'Scathach':[
        {type:"talent", name:"Brawl", bonus:1},
        {type:"skill", name:"Melee", bonus:1},
    ]
}

export const applyAttributeBonus = (attributes, name, bonus) => {
    const group = attributeMap[name];
    return {
        ...attributes,
        [group]: attributes[group].map(attr =>
            attr.name === name
                ? { ...attr, freeLevels: attr.freeLevels + bonus }
                : attr
        )
    };
};

const applyAbilityBonus = (abilities, type, name, bonus) => {
    return {
        ...abilities,
        [type]: abilities[type].map(skill =>
            skill.name === name
                ? { ...skill, freeLevels: skill.freeLevels + bonus }
                : skill
        )
    };
};

const applyBonuses = (state, bonuses, sign = 1) => {
    let newAttributes = state.attributes;
    let newAbilities = state.abilities;

    for (const bonus of bonuses) {
        const amount = sign * bonus.bonus;
        switch (bonus.type) {
            case 'attribute':
                newAttributes = applyAttributeBonus(newAttributes, bonus.name, amount);
                break;
            case 'talent':
                newAbilities = applyAbilityBonus(newAbilities, 'Talent', bonus.name, amount);
                break;
            case 'skill':
                newAbilities = applyAbilityBonus(newAbilities, 'Skill', bonus.name, amount);
                break;
            default:
                console.warn(`Unknown bonus type: ${bonus.type}`);
        }
    }

    return {
        ...state,
        attributes: newAttributes,
        abilities: newAbilities
    };
};

export const reducer = (state, action) =>
{
    switch (action.type) {
        case 'loadData':
            return { ...state, loading: false, error: null, ...action.payload };
        case 'resetDirty':
            return {
                ...state,
                hasChanges:false
            };
                case 'addBackground':
        return {
                ...state,
                hasChanges:true,
                backgrounds:[
                    ...state.backgrounds,
                    action.background
                ]
            }
        case "deleteBackground":
            return {
                ...state,
                hasChanges:true,
                backgrounds:state.backgrounds.filter(background => background.id !== action.backgroundId)
            }
        case 'addMerit':
            return {
                ...state,
                hasChanges:true,
                merits:[...state.merits, action.merit]
            };
        case "deleteMerit":
            return {
                ...state,
                hasChanges: true,
                merits: state.merits.filter(merit => merit.id !== action.meritId),
            };
        case "addFlaw":
            return {
                ...state,
                hasChanges:true,
                flaws:[...state.flaws, action.flaw]
            };
        case "deleteFlaw":

            return {
                ...state,
                hasChanges: true,
                flaws: state.flaws.filter(flaw => flaw.id !== action.flawId),
            };

        case 'updateAttribute':
            return {
                ...state,
                hasChanges: true,
                attributes: {
                    ...state.attributes,
                    [action.useGroup]: state.attributes[action.useGroup].map(attribute =>
                        attribute.name === action.name
                            ? updateSpendable(attribute, action, action.field)
                            : attribute
                    ),
                },
            };

        case 'updateAbility':
            return {
                ...state,
                hasChanges: true,
                abilities: {
                    ...state.abilities,
                    [action.useGroup]: state.abilities[action.useGroup].map(ability =>
                        ability.name === action.name
                            ? updateSpendable(ability, action, action.field)
                            : ability
                    ),
                },
            };

        case 'updateTemper':
            const key = action.temper;
            const updatedTemper = updateSpendable(state.tempers[key], action, action.field);
            return {
                ...state,
                hasChanges:true,
                tempers: {...state.tempers, [key]: updatedTemper},
            };

        case 'updateArt':
            return {
                ...state,
                hasChanges: true,
                arts: state.arts.map(art =>
                    art.name === action.name
                        ? updateSpendable(art, action, action.field)
                        : art
                ),
            };

        case 'updateRealm':
            return {
                ...state,
                hasChanges: true,
                realms: state.realms.map(realm =>
                    realm.name === action.name
                        ? updateSpendable(realm, action, action.field)
                        : realm
                ),
            };

        // Repeat for backgrounds, merits, flaws if they use SpendableReducer logic
        case 'updateBackground':
            return {
                ...state,
                hasChanges: true,
                backgrounds: state.backgrounds.map(bg =>
                    bg.id === action.id
                        ? updateSpendable(bg, action, action.field)
                        : bg
                ),
            };

        case 'updateMerit':
            return {
                ...state,
                hasChanges: true,
                merits: state.merits.map(merit =>
                    merit.id === action.id
                        ? updateSpendable(merit, action, action.field)
                        : merit
                ),
            };

        case 'updateFlaw':
            return {
                ...state,
                hasChanges: true,
                flaws: state.flaws.map(flaw =>
                    flaw.id === action.id
                        ? updateSpendable(flaw, action, action.field)
                        : flaw
                ),
            };

        case "updateCharacterDetail":
            return {
                ...state,
                [action.field]:action.value
            }
        case "updateHouseBonuses":
        {
            const oldHouse = state.house;
            const newHouse = action.value;

            const oldBonuses = houseBonuses[oldHouse] ?? [];
            const newBonuses = houseBonuses[newHouse] ?? [];

            let newState = { ...state, house: newHouse };

            // Remove old bonuses
            if (oldBonuses.length) {
                newState = applyBonuses(newState, oldBonuses, -1);
            }

            // Apply new bonuses
            if (newBonuses.length) {
                newState = applyBonuses(newState, newBonuses, 1);
            }

            return newState;
        }
        case "updateKithBonuses": {
            const oldKith = state.kith;
            const newKith = action.value;

            let oldBonus = oldKith ? { ...kithBonuses[oldKith] } : null;
            let newBonus = newKith ? { ...kithBonuses[newKith] } : null;

            if (!oldBonus && !newBonus) return state;

            // Troll gets +2 if second Oath is sworn
            if (state.secondOathSworn) {
                if (oldKith === 'Troll') oldBonus.bonus += 2;
                if (newKith === 'Troll') newBonus.bonus += 2;
            }

            let newState = { ...state, kith: newKith };

            if (oldBonus) {
                newState.attributes = applyAttributeBonus(newState.attributes, oldBonus.name, -oldBonus.bonus);
            }

            if (newBonus) {
                newState.attributes = applyAttributeBonus(newState.attributes, newBonus.name, newBonus.bonus);
            }

            return newState;
        }
        default:
            console.warn(`Unhandled action type ${action.type}`);
            return state;
    }
}

export const blankSheet = (json) => ({
    loading: true,
    error: null,
    hasChanges: false,
    player:json?.player,
    chronicle:json?.chronicle,
    kith:json?.kith,
    house:json?.house,
    name:json?.name,
    court:json?.court,
    legacies:{seelie:json?.legacies?.seelie ?? '', unseelie:json?.legacies?.unseelie ?? ''},
    seeming:json?.seeming,
    motley:json?.motley,
    secondOathSworn:!!(json?.secondOathSworn),
    glamourSpent:Number(json?.glamourSpent ?? 0),
    willpowerSpent:Number(json?.willpowerSpent ?? 0),
    attributes: { Physical: [], Social: [], Mental: [] },
    abilities: { Talent: [], Skill: [], Knowledge: [] },
    arts: [],
    realms: [],
    merits: [],
    flaws: [],
    backgrounds: [],
    tempers:{Glamour:{name:"Glamour"}, Willpower:{name:"Willpower"}},
});

export const attributeMap = {
    'Strength':'Physical', 'Dexterity':'Physical', 'Stamina':'Physical',
    'Charisma':'Social', 'Manipulation':'Social', 'Appearance':'Social',
    'Intelligence':'Mental', 'Wits':'Mental', 'Perception':'Mental'
};

export const flattenSheet=(sheet)=>
{
    const flattened =  {...sheet,
        traits:[
        ...Object.values(sheet?.attributes ?? {}).flatMap(g => g),
        ...Object.values(sheet?.abilities ?? {}).flatMap(g => g),
        ...Object.values(sheet?.arts ?? []),
        ...Object.values(sheet?.realms ?? []),
        ...Object.values(sheet?.backgrounds ?? []),
        ...Object.values(sheet?.merits ?? []),
        ...Object.values(sheet?.flaws ?? []),
        ...Object.values(sheet?.traits??[]),
    ]};
    delete flattened.attributes;
    delete flattened.abilities;
    delete flattened.realms;
    delete flattened.arts;
    delete flattened.backgrounds;
    delete flattened.flaws;
    delete flattened.merits;

    return flattened;
}