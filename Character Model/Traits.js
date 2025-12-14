'use strict';
class Trait
{
    constructor(name, cp, fp, xp)
    {
      this.name = name;
      this.cp = cp?cp:0;
      this.fp = fp?fp:0;
      this.xp = xp?xp:0;
      this.freeLevels = 0;
      this.canRollUnlearned = this.constructor.CAN_ROLL_UNLEARNED;
      // set an explicit type property that will survive minification
      this.type = (this.constructor.TYPE || this.constructor.name).toLowerCase();
      this.calculateLevel();
      this.specialty = null;
    }

    setFreeLevels(freeLevels)
    {
      this.freeLevels = freeLevels;
      this.calculateLevel();
    }

    setSpecialty(specialty)
    {
        this.specialty = specialty;
    }

    calculateLevel()
    {
      let level= this.constructor.BASE  + this.cp + Math.floor(this.fp/this.constructor.FP_COST);
      let xpLeft = this.xp;
      let xpToLevel= level?this.constructor.XP_COST * level:this.constructor.FIRST_XP_COST;
      while(xpLeft >= xpToLevel)
      {
          xpLeft -= xpToLevel;
          level++;
          xpToLevel = this.constructor.XP_COST * level;
      }
      level += this.freeLevels;
      this.level = level;
    }

    toJSON()
    {
        return {
            // use the explicit instance type (stable across minification)
            type:this.type,
            specialty:this.specialty,
            name:this.name,
            cp:this.cp,
            xp:this.xp,
            fp:this.fp,
            freeLevels:this.freeLevels,
            // persist id when present so the UI and other clients can reference distinct instances
            id: this.id
        };
    }

    static fromJSON(json)
    {
        let trait = new this(json.name, json.cp?json.cp:0, json.fp?json.fp:0, json.xp?json.xp:0);
        trait.setFreeLevels(json.freeLevels);
        if(typeof json.id !== 'undefined')
        {
            trait.id = json.id;
        }
        return trait;
    }
}


Trait.BASE = 0;
Trait.XP_COST = 1;
Trait.FP_COST = 1;
Trait.FIRST_XP_COST = 1;
Trait.CAN_ROLL_UNLEARNED = false;

class Attribute extends Trait{}
Attribute.XP_COST = 4;
Attribute.BASE = 1;
Attribute.FP_COST = 5;

class Ability extends Trait
{
  constructor(name, cp, fp, xp)
  {
    super(name, cp, fp, xp);
  }
}
Ability.XP_COST = 2;
Ability.FIRST_XP_COST = 3;
Ability.FP_COST = 2;
Ability.CAN_ROLL_UNLEARNED=true;
Ability.UNLEARNED_PENALTY=0;

class Talent extends Ability{}
class Skill extends Ability{}
Skill.UNLEARNED_PENALTY = +1;
class Knowledge extends Ability{}
Knowledge.CAN_ROLL_UNLEARNED=false;



class Art extends Trait{}
Art.FP_COST = 5;
Art.XP_COST = 4;
Art.FIRST_XP_COST = 7;



class Glamour extends Trait
{
  constructor(cp, fp, xp)
  {
    super("Glamour", cp, fp, xp);
  }
}
Glamour.XP_COST = 3;
Glamour.FP_COST = 3;
Glamour.BASE = 4;


class Willpower extends Trait
{
  constructor(cp, fp, xp)
  {
    super("Willpower", cp, fp, xp);
  }
}
Willpower.FP_COST = 1;
Willpower.XP_COST = 2;
Willpower.BASE = 4;

class Realm extends Trait
{
    constructor(name, cp, fp, xp, favoured)
    {
        super(name, cp?cp:0, fp?fp:0, xp?xp:0);
        this.favoured = favoured?favoured:false;
    }

    toJSON()
    {
        let json = super.toJSON();
        json.favoured = this.favoured;
        return json;
    }
}
Realm.XP_COST = 3;
Realm.FIRST_XP_COST =5;
Realm.FP_COST = 2;

class Background extends Ability{}
Background.FP_COST = 1;

class Merit extends Background{}
class Flaw extends Background{}

// Explicit TYPE constants to avoid relying on constructor.name at runtime (minifiers rename names)
Trait.TYPE = 'trait';
Attribute.TYPE = 'attribute';
Ability.TYPE = 'ability';
Talent.TYPE = 'talent';
Skill.TYPE = 'skill';
Knowledge.TYPE = 'knowledge';
Art.TYPE = 'art';
Realm.TYPE = 'realm';
Background.TYPE = 'background';
Merit.TYPE = 'merit';
Flaw.TYPE = 'flaw';
Glamour.TYPE = 'glamour';
Willpower.TYPE = 'willpower';

export {
    Trait, Attribute, Ability, Talent, Skill, Knowledge, Art, Realm, Background, Glamour, Willpower, Flaw, Merit
};
