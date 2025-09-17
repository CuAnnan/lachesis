import Controller from "./Controller.js";
import blankSheetSchema from "../schema/blankSheetSchema.js";
const xp = 0, cp = 0, fp = 0;

const sheetStructure = blankSheetSchema;


const sheetJSON = {};

sheetJSON.traits = [
    ...Object.entries(sheetStructure.attributes).flatMap(([_group, list])=>
        list.map(name=>({type:'Attribute', name}))
    ),
    ...Object.entries(sheetStructure.abilities).flatMap(([group, list]) =>
        list.map(name => ({ type: group, name }))
    ),
    ...sheetStructure.arts.map(art=>({type:'Art', name:art})),
    ...sheetStructure.realms.map(realm => ({ type: 'Realm', name: realm }))
].map(trait => ({ ...trait, cp, xp, fp }));

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
        res.status(200).json(sheetJSON.sheet);
    }

    async getSheetsByHash(hash)
    {
        let collection = this.db.collection('sheets');
        let sheetsCursor = await collection.find({digest:hash});
        if(!sheetsCursor)
        {
            throw new Error(`No sheet found for user`);
        }
        const sheets = [];
        for await(let sheet of sheetsCursor)
        {
            sheets.push(sheet);
        }
        return sheets;
    }

    async getSheetByHashAndNanoid({hash, nanoid})
    {
        const collection = this.db.collection('sheets');
        const sheet = await collection.findOne({digest:hash, nanoid});
        if(!sheet)
        {
            throw new Error(`No sheet found for user with that unique id`);
        }
        const loadedSheetsCollection = this.db.collection('loadedSheets');

        try {
            await loadedSheetsCollection.updateOne({hash}, {$set:{nanoid}}, {upsert:true});

            return sheet;
        }
        catch(err)
        {
            console.log(err);
            throw err;
        }
    }

    async getBlankSheet(req, res)
    {
        res.status(200).json(sheetJSON);
    }

    static getBlankSheetDocument()
    {
        return sheetJSON;
    }

    async saveSheet(req, res)
    {
        let collection = this.db.collection('sheets');
        await collection.findOneAndUpdate({nanoid:req.body.nanoid}, {$set:{sheet:req.body.sheet}});

        res.status(200).json({status: 'success'});
    }

    static getInstance()
    {
        return super.getInstance(this);
    }
}

export default SheetController;