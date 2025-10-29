import Controller from "./Controller.js";
import KithainSheet from "../../Character Model/KithainSheet.js";
//import DiceRoll from "../Character Model/DiceRoll.js";
import {nanoid} from "nanoid";

import blankSheetSchema from "../schema/blankSheetSchema.js";
//const xp = 0, cp = 0, fp = 0;




class SheetController extends Controller
{
    async getSheetDocument(req, res)
    {
        let sheetJSON = await this.collection.findOne({nanoid:req.params.nanoid});

        if(!sheetJSON)
        {
            throw new Error(`No sheet found for nanoid ${req.params.nanoid}`);
        }
        res.status(200).json(sheetJSON.sheet);
    }



    async getSheetsByHash(hash)
    {
        let sheetsCursor = await this.collection.find({digest:hash});
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

    async addSheet({hash, guildId, name})
    {
        const sheetDocument = {digest:hash, guildId, nanoid:nanoid(), sheet:{...blankSheetSchema, name}};
        await this.collection.insertOne(sheetDocument);
        return sheetDocument.nanoid;
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

        const sheetDocument = await this.collection.findOne({digest:hash, nanoid});
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
        res.status(200).json(blankSheetSchema);
    }

    static getBlankSheetDocument()
    {
        return blankSheetSchema;
    }

    async saveSheet(req, res)
    {
        await this.collection.findOneAndUpdate({nanoid:req.body.nanoid}, {$set:{sheet:req.body.sheet}});

        res.status(200).json({status: 'success'});
    }

    static getInstance()
    {
        return super.getInstance(this);
    }

    get collection()
    {
        return this.db.collection('sheets');
    }
}

export default SheetController;
