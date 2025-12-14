'use strict';

import { Trait, Attribute, Ability, Talent, Skill, Knowledge, Art, Realm, Background, Glamour, Willpower, Flaw, Merit } from "./Traits.js";

const TYPE_MAP = {
    trait: Trait,
    attribute: Attribute,
    ability: Ability,
    talent: Talent,
    skill: Skill,
    knowledge: Knowledge,
    art: Art,
    realm: Realm,
    background: Background,
    merit: Merit,
    flaw: Flaw,
    glamour: Glamour,
    willpower: Willpower
};

class Sheet
{
    constructor()
    {
        this.name = null;
        this.player = null;
        this.chronicle = null;
        this.traits = {};
        this.structuredTraits = {};
    }

    get attributes()
    {
        return {
            'physical':{strength:this.structuredTraits.attribute.strength, dexterity:this.structuredTraits.attribute.dexterity, stamina:this.structuredTraits.attribute.stamina},
            'mental':{perception:this.structuredTraits.attribute.perception, intelligence:this.structuredTraits.attribute.intelligence, wits:this.structuredTraits.attribute.wits},
            'social':{charisma:this.structuredTraits.attribute.charisma, manipulation:this.structuredTraits.attribute.manipulation, appearance:this.structuredTraits.attribute.appearance},
        };
    }

    get abilities()
    {
        return {
            'talents':this.structuredTraits.talent,
            'skills':this.structuredTraits.skill,
            'knowledges':this.structuredTraits.knowledge,
        }
    }

    get merits()
    {
        return this.structuredTraits.merit || {};
    }

    get flaws()
    {
        return this.structuredTraits.flaw || {};
    }

    get backgrounds()
    {
        return this.structuredTraits.background || {};
    }

    addTrait(trait)
    {
        // Prefer an explicit runtime type (trait.type) or a static TYPE constant; fall back to constructor.name
        let cName = (trait.type || trait.constructor.TYPE || trait.constructor.name).toLowerCase();
        let traitKey = trait.name.toLowerCase();
        if(cName === 'background')
        {
            traitKey += (trait.specialty?('-'+trait.specialty):'');
        }

        // Store in the flat traits index. Support multiple traits with the same name by turning the value
        // into an array if necessary (backwards-compatible with single-trait consumers).
        let existingIndexEntry = this.traits[traitKey];
        if(!existingIndexEntry)
        {
            this.traits[traitKey] = trait;
        }
        else if(Array.isArray(existingIndexEntry))
        {
            existingIndexEntry.push(trait);
        }
        else
        {
            this.traits[traitKey] = [existingIndexEntry, trait];
        }

        // Maintain structuredTraits per category, also allowing multiple traits under the same key.
        if(!this.structuredTraits[cName])
        {
            this.structuredTraits[cName] = {};
        }
        let existingStructured = this.structuredTraits[cName][traitKey];
        if(!existingStructured)
        {
            this.structuredTraits[cName][traitKey] = trait;
        }
        else if(Array.isArray(existingStructured))
        {
            existingStructured.push(trait);
        }
        else
        {
            this.structuredTraits[cName][traitKey] = [existingStructured, trait];
        }
    }

    toJSON()
    {
        // Serialize to a flat array of trait JSON objects so duplicates are preserved.
        let traitsArray = [];
        for(let key of Object.keys(this.traits))
        {
            let entry = this.traits[key];
            if(Array.isArray(entry))
            {
                for(let t of entry)
                {
                    traitsArray.push(t.toJSON());
                }
            }
            else if(entry)
            {
                traitsArray.push(entry.toJSON());
            }
        }

        return {
            name: this.name,
            player: this.player,
            chronicle: this.chronicle,
            traits: traitsArray
        };
    }


    getPool(traitNames)
    {
        let poolData = {
            traits:[],
            dicePool:0,
            valid:true
        };

        for(let traitName of traitNames)
        {
            // numeric literal contributor
            if(!Number.isNaN(parseInt(traitName)))
            {
                poolData.dicePool += Math.floor(traitName);
                poolData.traits.push(String(traitName));
                continue;
            }

            // Try to resolve traitName as an id first. Search structuredTraits for a matching id.
            let foundById = null;
            for(const category of Object.values(this.structuredTraits))
            {
                for(const entry of Object.values(category))
                {
                    if(Array.isArray(entry))
                    {
                        const match = entry.find(t => t.id === traitName);
                        if(match){ foundById = match; break; }
                    }
                    else if(entry && entry.id === traitName)
                    {
                        foundById = entry;
                        break;
                    }
                }
                if(foundById) break;
            }

            if(foundById)
            {
                poolData.traits.push(foundById.name);
                poolData.dicePool += foundById.level;
                if(!foundById.canRollUnlearned && foundById.level === 0)
                {
                    poolData.valid = false;
                }
                continue;
            }

            // Fallback: treat traitName as a display name, lookup by lowercased key (may be array when duplicates exist)
            const key = traitName.toLowerCase();
            let traitEntry = this.traits[key];
            if(!traitEntry)
            {
                throw new Error("Trait "+traitName+" not found");
            }

            poolData.traits.push(traitName);

            if(Array.isArray(traitEntry))
            {
                // Try to find a single trait in the array that matches the requested display name (case-insensitive).
                // This lets the UI select one duplicate by name when duplicates also differ by specialty; if there
                // is an exact match by trait.name use that single trait. If not, fall back to summing all (legacy behaviour).
                const matchByName = traitEntry.find(t => t.name && t.name.toLowerCase() === traitName.toLowerCase());
                if(matchByName)
                {
                    poolData.dicePool += matchByName.level;
                    if(!matchByName.canRollUnlearned && matchByName.level === 0)
                    {
                        poolData.valid = false;
                    }
                }
                else
                {
                    for(let trait of traitEntry)
                    {
                        poolData.dicePool += trait.level;
                        if(!trait.canRollUnlearned && trait.level === 0)
                        {
                            poolData.valid = false;
                        }
                    }
                }
            }
            else
            {
                poolData.dicePool += traitEntry.level;
                if(!traitEntry.canRollUnlearned && traitEntry.level === 0)
                {
                    poolData.valid = false;
                }
            }

        }

        return poolData;
    }

    finalize()
    {
    }

    applySplatJSON(json)
    {

    }

    addTraitFromJSON(traitJSON)
    {
        // Use the explicit type field (added to Trait.toJSON) to find the right class
        let type = (traitJSON.type || 'trait').toLowerCase();
        let Klass = TYPE_MAP[type] || Trait;
        // Use the class's static fromJSON to construct (it uses `this` so it will create an instance of the right subclass)
        let trait = Klass.fromJSON ? Klass.fromJSON(traitJSON) : new Klass(traitJSON.name, traitJSON.cp?traitJSON.cp:0, traitJSON.fp?traitJSON.fp:0, traitJSON.xp?traitJSON.xp:0);
        // restore specialty and other properties that aren't handled by fromJSON
        if(traitJSON.specialty)
        {
            trait.specialty = traitJSON.specialty;
        }
        if(typeof traitJSON.favoured !== 'undefined')
        {
            trait.favoured = traitJSON.favoured;
        }
        if(typeof traitJSON.id !== 'undefined')
        {
            trait.id = traitJSON.id;
        }

        this.addTrait(trait);
    }

    static async fromJSON(json)
    {
        let sheet = new this();
        // Ensure every trait JSON has a stable id so the model-level deserialization produces trait instances with ids.
        let idCounter = 1;
        for(let traitJSON of json.traits)
        {
            if(typeof traitJSON.id === 'undefined' || traitJSON.id === null || traitJSON.id === '')
            {
                // Prefer a type-prefixed id when possible
                const prefix = (traitJSON.type || 't').toString().toLowerCase();
                traitJSON.id = `${prefix}-${Date.now().toString(36)}-${idCounter++}`;
            }
            sheet.addTraitFromJSON(traitJSON);
        }
        sheet.name = json.name;
        sheet.player = json.player;
        sheet.chronicle = json.chronicle;
        sheet.applySplatJSON(json);
        sheet.finalize();
        return sheet;
    }

    

}


export default Sheet;