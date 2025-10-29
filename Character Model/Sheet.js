'use strict';

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
        let cName = trait.constructor.name.toLowerCase();
        let traitKey = trait.name.toLowerCase();
        if(cName === 'background')
        {
            traitKey += (trait.specialty?('-'+trait.specialty):'');
        }
        this.traits[traitKey] = trait;

        if(!this.structuredTraits[cName])
        {
            this.structuredTraits[cName] = {};
        }
        this.structuredTraits[cName][traitKey] = trait;
    }

    toJSON()
    {

    }


    getPool(traitNames)
    {
        let poolData = {
            traits:traitNames,
            dicePool:0,
            valid:true
        };
        for(let traitName of traitNames)
        {
            if(Number.isNaN(parseInt(traitName)))
            {
                let trait = this.traits[traitName.toLowerCase()];
                if(!trait)
                {
                    throw new Error("Trait "+traitName+" not found");
                }
                poolData.dicePool += trait.level;
                if(!trait.canRollUnlearned && trait.level === 0)
                {
                    poolData.valid = false;
                }
            }
            else
            {
                poolData.dicePool += Math.floor(traitName);
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
    }

    static async fromJSON(json)
    {
        let sheet = new this();
        for(let traitJSON of json.traits)
        {
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