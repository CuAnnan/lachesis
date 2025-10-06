function SpendableReducer(state, action, xpCost, fpCost, firstLevelXPCost, startLevel = 0)
{
    let newState;
    switch (action.type) {
        case 'setNAME':
            newState = {...state, name: action.name};
            break;
        case 'setSPECIALTY':
            newState = {...state, specialty: action.specialty};
            break;
        case 'setFP':
            newState = { ...state, fp: action.fp??0 };
            break;
        case 'setCP':
            newState = { ...state, cp: action.cp??0 };
            break;
        case 'setXP':
            newState = { ...state, xp: action.xp??0 };
            break;
        case 'load':
            newState = action.payload;
            break;
        default:
            newState = state;
            break;
    }

    
    // Calculate level and xpToLevel
    let level = startLevel + Math.floor((newState.cp??0) + (newState.fp??0) / fpCost);
    
    let xp = newState.xp;
    if(level === 0)
    {
        if(xp > firstLevelXPCost)
        {
            xp -= firstLevelXPCost;
            level ++;
        }
    }
    while (level > 0 && xp >= level * xpCost) {
        xp -= level * xpCost;
        level++;
    }
    

    newState.level = level + Number(newState.freeLevels ?? 0);

    newState.xpToLevel = level === 0?firstLevelXPCost:level * xpCost;
    
    return newState;
}

export default SpendableReducer;