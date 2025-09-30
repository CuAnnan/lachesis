import Controller from "./Controller.js";
import KithainSheet from "../Character Model/KithainSheet.js";
import DiceRoll from "../Character Model/DiceRoll.js";

//import blankSheetSchema from "../schema/blankSheetSchema.js";
//const xp = 0, cp = 0, fp = 0;

//const sheetStructure = blankSheetSchema;



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

    async getSheetByDigest(hash)
    {
        const loadedSheetsCollection = this.db.collection('loadedSheets');
        const nanoid = (await loadedSheetsCollection.findOne({hash})).nanoid;
        if(!nanoid)
        {
            throw new Error("There is no sheet loaded for your account on this Server");
        }
        return await this.getSheetByHashAndNanoid({hash, nanoid});
    }

    async getSheetByHashAndNanoid({hash, nanoid})
    {
        const cacheHash = hash+":"+nanoid;

        let sheet = this.objectCache.get(cacheHash);
        if(sheet)
        {
            return sheet;
        }

        const collection = this.db.collection('sheets');
        const sheetDocument = await collection.findOne({digest:hash, nanoid});
        if(!sheetDocument)
        {
            throw new Error(`No sheet found for user with that unique id`);
        }
        const loadedSheetsCollection = this.db.collection('loadedSheets');

        try {
            await loadedSheetsCollection.updateOne({hash}, {$set:{nanoid}}, {upsert:true});
            sheet = await KithainSheet.fromJSON(sheetDocument.sheet);
            this.objectCache.set(cacheHash, sheet);
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
