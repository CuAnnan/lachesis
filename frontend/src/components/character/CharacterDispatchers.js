import { useMemo, useRef } from "react";

/**
 * Returns dispatch‑wrapper callbacks.
 *
 * @param dispatch  Reducer dispatch function from useReducer.
 * @returns An object whose keys are the action helpers.
 */
export const CharacterDispatchers = (dispatch) => {
    const backgroundId = useRef(1);


    return useMemo(() => {
        const getNextBackgroundId = ()=> backgroundId.current++;


        const updateArt = (art, field, value) => {
            dispatch({ type: "updateArt", art, field, value });
        };

        const updateRealm = (realm, field, value) => {
            dispatch({ type: "updateRealm", realm, field, value });
        };

        const addBackground = (background) => {
            dispatch({
                type: "addBackground",
                background: { ...background, id: backgroundId.current++ },
            });
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
            addBackground,
            setAttribute,
            setAbility,
            updateBackground,
            updateCharacterDetail,
            updateLegacy,
            getNextBackgroundId
        };
    }, [dispatch]);
};