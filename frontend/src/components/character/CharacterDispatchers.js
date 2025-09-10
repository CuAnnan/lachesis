import { useMemo, useRef } from "react";

/**
 * Returns dispatch‑wrapper callbacks.
 *
 * @param dispatch  Reducer dispatch function from useReducer.
 * @returns An object whose keys are the action helpers.
 */
export const CharacterDispatchers = (dispatch) => {
    const ids = {
        background:useRef(1),
        merit:useRef(1),
        flaw:useRef(1)
    }

    return useMemo(() => {
        const getNextBackgroundId = ()=> ids.background.current++;
        const getNextMeritId = ()=> ids.merit.current++;
        const getNextFlawId = ()=> ids.flaw.current++;


        const updateArt = (art, field, value) => {
            dispatch({ type: "updateArt", art, field, value });
        };

        const updateRealm = (realm, field, value) => {
            dispatch({ type: "updateRealm", realm, field, value });
        };

        const setAttribute = (useGroup, name, field, value) => {
            dispatch({
                type: "updateAttribute",
                useGroup,
                name,
                field,
                value,
            });
        };

        const setAbility = (useGroup, name, field, value) => {
            dispatch({
                type: "updateAbility",
                useGroup,
                name,
                field,
                value,
            });
        };

        const addFlaw = (flaw)=>{
            dispatch({
                type: "addFlaw",
                flaw:{...flaw, ids:ids.flaw.current++}
            });
        };

        const updateFlaw = (flawId, field, value)=>{
            dispatch({
                type: "updateFlaw",
                flawId,
                field,
                value
            })
        };

        const addMerit = (merit) =>
        {
            dispatch({
                type: "addMerit",
                merit:{...merit, id:ids.merit.current++},
            })
        }

        const updateMerit = (meritId, field, value)=>
        {
            dispatch({
                type:'updateMerit',
                meritId,
                field,
                value
            });
        }

        const addBackground = (background) => {
            dispatch({
                type: "addBackground",
                background: { ...background, id: ids.background.current++ },
            });
        };


        const updateBackground = (bgId, field, value) => {
            dispatch({
                type: "updateBackground",
                backgroundId: bgId,
                field,
                value,
            });
        };

        const updateCharacterDetail = (field, value) => {
            if (field === "house")
            {
                dispatch({ type: "updateHouseBonuses", field, value });
            }
            else if (field === "kith")
            {
                dispatch({ type: "updateKithBonuses", field, value });
            }
            else
            {
                dispatch({type: "updateCharacterDetail", field, value});
            }
        };

        const updateLegacy = (court, legacy) => {
            dispatch({ type: "updateLegacy", court, legacy });
        };

        return {
            updateArt,
            updateRealm,
            setAttribute,
            setAbility,
            updateCharacterDetail,
            updateLegacy,
            getNextBackgroundId,
            updateBackground,
            addBackground,
            getNextMeritId,
            updateMerit,
            addMerit,
            getNextFlawId,
            addFlaw,
            updateFlaw
        };
    }, [dispatch, ids.background, ids.flaw, ids.merit]);
};