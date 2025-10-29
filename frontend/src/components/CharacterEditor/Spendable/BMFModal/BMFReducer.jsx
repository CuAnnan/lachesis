import SpendableReducer from "../SpendableReducer.js";

const costs = {
    xp:2,
    fp:1,
    firstLevel:3
}

const reducer = (state, action)=>
{
    return SpendableReducer(state, action, costs.xp, costs.fp, costs.firstLevel);
};

export default reducer;