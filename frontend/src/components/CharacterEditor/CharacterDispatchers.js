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


        const updateArt = (artOrId, field, value) => {
            // artOrId may be an object (art) or a string id/name. Normalize payload.
            if (typeof artOrId === 'object' && artOrId !== null) {
                dispatch({ type: "updateArt", name: artOrId.name, id: artOrId.id, field, value });
            } else {
                // If we only have a primitive id/name, send it as both name and id so reducer can match by id
                const idOrName = String(artOrId);
                dispatch({ type: "updateArt", name: idOrName, id: idOrName, field, value });
            }
        };

        const updateRealm = (realmOrId, field, value) => {
            if (typeof realmOrId === 'object' && realmOrId !== null) {
                dispatch({ type: "updateRealm", name: realmOrId.name, id: realmOrId.id, field, value });
            } else {
                const idOrName = String(realmOrId);
                dispatch({ type: "updateRealm", name: idOrName, id: idOrName, field, value });
            }
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
                flaw:{...flaw, id:ids.flaw.current++}
            });
        };

        const updateFlaw = (flawId, field, value)=>{
            dispatch({
                type: "updateFlaw",
                id: flawId,
                field,
                value
            })
        };

        const deleteFlaw = (flawId) =>
        {
            dispatch({
                type: "deleteFlaw",
                flawId
            })
        }

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
                id: meritId,
                field,
                value
            });
        }

        const deleteMerit = (meritId)=>{
            dispatch({
                type:"deleteMerit",
                meritId
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
                id: bgId,
                field,
                value,
            });
        };

        const deleteBackground = (backgroundId) => {
            dispatch({
                type: "deleteBackground",
                backgroundId
            })
        }

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

        const updateTemper = (temper, field, value) => {
            dispatch({type: "updateTemper", temper, field, value});
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
            deleteBackground,
            getNextMeritId,
            updateMerit,
            deleteMerit,
            addMerit,
            getNextFlawId,
            addFlaw,
            updateFlaw,
            deleteFlaw,
            updateTemper
        };
    }, [dispatch, ids.background, ids.flaw, ids.merit]);
};