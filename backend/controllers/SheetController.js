import Controller from "./Controller.js";

class SheetController extends Controller
{
    async getSheetDocument(req, res)
    {
        let collection = this.db.collection('sheets');
        let sheetJSON = await collection.findOne({nanoid:req.params.nanoid});
        if(!sheetJSON)
        {
            throw new Error(`No sheet found for nanoid ${req.params.nanoid}`);
        }
        res.json(sheetJSON.sheet);
    }

    async getBlankSheet(req, res)
    {
        const sheetStructure = {
            attributes:{
                Physical:['Strength', 'Dexterity', 'Stamina'],
                Social:['Charisma', 'Manipulation', 'Appearance'],
                Mental:['Perception', 'Intelligence', 'Wits']
            },
            abilities:{
                Talent:['Alertness','Athletics','Brawl','Empathy','Expression','Intimidation', 'Kenning','Leadership','Streetwise','Subterfuge'],
                Skill:['Animal Ken','Crafts','Drive','Etiquette','Firearms','Larceny','Melee','Performance','Stealth','Survival'],
                Knowledge:['Academics','Computer','Enigmas','Gremayre','Investigation','Law','Medicine','Politics','Science','Technology']
            }
        };
        const xp = 0, cp = 0, fp = 0;
        let sheetJSON = {traits:[]};

        for(let [useGroup, attributes] of Object.entries(sheetStructure.attributes))
        {
            for(let attribute of attributes)
            {
                sheetJSON.traits.push(
                    {type:'Attribute', name:attribute, cp, xp, fp}
                );
            }
        }
        for(let [useGroup, abilities] of Object.entries(sheetStructure.abilities))
        {
            for(let ability of abilities)
            {
                sheetJSON.traits.push(
                    {type:useGroup,name:ability,cp,xp,fp}
                )
            }
        }

        res.json(sheetJSON);
    }
}

export default SheetController;