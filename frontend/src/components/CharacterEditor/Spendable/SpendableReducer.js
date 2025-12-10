function SpendableReducer(state, action, xpCost, fpCost, firstLevelXPCost, startLevel = 0)
{
    let newState = {...state};
    switch (action.type) {
        case 'setNAME':
            newState = {...newState, name: action.name};
            break;
        case 'setSPECIALTY':
            newState = {...newState, specialty: action.specialty};
            break;
        case 'setFP':
            newState = { ... newState, fp: action.fp??0 };
            break;
        case 'setCP':
            newState = { ...newState, cp: action.cp??0 };
            break;
        case 'setXP':
            newState = { ...newState, xp: action.xp??0 };
            break;
        case 'load':
            newState = action.payload;
            break;
        case 'setTemper':
            console.log("Set temper", action);
            break;
        default:
            newState = state;
            break;
    }
    newState.xpCost = xpCost;
    newState.fpCost = fpCost;
    newState.firstLevelXPCost = firstLevelXPCost;
    newState.startLevel = startLevel;

    
    // Calculate level and xpToLevel
    let level = startLevel + Math.floor((newState.cp??0) + (newState.fp??0) / fpCost);
    
    let xp = newState.xp;
    if(level === 0)
    {
        if(xp >= firstLevelXPCost)
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