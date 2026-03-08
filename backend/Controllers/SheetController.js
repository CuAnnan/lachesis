import Controller from "./Controller.js";
import KithainSheet from "../../Character Model/KithainSheet.js";
import QRCode from "qrcode";
import blankSheetSchema from "../schema/blankSheetSchema.js";
import conf from "../../conf.js";
import {nanoid} from "nanoid";
import DiceRoll from "../../Character Model/DiceRoll.js";

const webPresence = conf.frontend.url;



class SheetController extends Controller
{
    async getSheetDocument(req, res)
    {
        let sheetJSON = await this.collection.findOne({nanoid:req.params.nanoid});

        if(!sheetJSON)
        {
            throw new Error(`No sheet found for nanoid ${req.params.nanoid}`);
        }

        const sheet = await KithainSheet.fromJSON(sheetJSON.sheet);
        const result = {...await this.getSheetData(sheet), sheet:sheetJSON.sheet};
        res.status(200).json(result);
    }


    async roll(req, res)
    {
        let sheet = this.objectCache.get(req.params.nanoid);
        if(!sheet)
        {
            const document = await this.collection.findOne({nanoid:req.params.nanoid});
            sheet = await KithainSheet.fromJSON(document.sheet);
            this.objectCache.set(req.params.nanoid, sheet);
        }
        const {traits, diff, specialty, wyrd, willpower} = req.body
        const dicePool = sheet.getPool(traits);

        const roll = new DiceRoll({traits, dicePool, diff, specialty, wyrd, willpower});
        res.status(200).json(roll.resolve());
    }

    async generateTemporaryViewLink(hash, sheetNano)
    {
        let temporaryLinkNano = nanoid();

        const sheet = await this.getSheetByHashAndNanoid({hash, nanoid: sheetNano});
        if(!sheet)
        {
            throw new Error("No sheet found for that user with that id");
        }
        const tempLinksCollection = this.db.collection('temporaryViewLinks');
        await tempLinksCollection.insertOne({nanoid:temporaryLinkNano, sheetNanoid:sheetNano, hash, expiresAt:Date.now() + 15*60*1000});
        return temporaryLinkNano;
    }


    async getSheetForTemporaryLink(req, res)
    {
        const tempLinksCollection = this.db.collection('temporaryViewLinks');
        const tempLink = await tempLinksCollection.findOne({nanoid:req.params.nanoid});
        if(!tempLink)
        {
            throw new Error("This temporary link is invalid or has expired");
        }
        if(tempLink.expiresAt < Date.now())
        {
            throw new Error("This temporary link has expired");
        }

        const sheet = await this.getSheetByHashAndNanoid({hash:tempLink.hash, nanoid:tempLink.sheetNanoid});
        const result = {...await this.getSheetData(sheet), sheet:sheet};
        res.status(200).json(result);
    }

    async getSheetData(sheet)
    {
        let kith = null;
        if(sheet.kith)
        {
            kith = await this.db.collection('kiths').findOne({name:sheet.kith});
        }
        let house = null;
        if(sheet.house)
        {
            house = await this.db.collection('houses').findOne({name:sheet.house});
        }

        let arts = [];
        for (const knownArt of Object.values(sheet.structuredTraits.art)) {
            let art = { name: knownArt.name, cantrips: [] };
            console.log(art.name);
            let artData = await this.db.collection('arts').findOne({ name: art.name });
            if(!artData)
            {
                const escapedName = art.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                artData = await this.db.collection('arts').findOne({name:{$regex:new RegExp(`^${escapedName}$`, 'i')}});
            }
            if(!artData)
            {
                const levels = Array.isArray(artData?.levels) ? artData.levels : [];
                for (let i = 0; i < knownArt.level; i++) {
                    if (levels[i]) {
                        art.cantrips.push(levels[i]);
                    }
                }
            }
            arts.push(art);
        }
        return {kith, house, arts};
    }



    async getSheetsByHash(hash)
    {
        const query = {digest:hash};
        const count = await this.collection.countDocuments(query);
        if(!count)
        {
            throw new Error(`No sheet found for user`);
        }

        let sheetsCursor = await this.collection.find(query);
        if(!sheetsCursor)
        {
            console.log(hash);
            throw new Error(`An error occured.`);
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

    async addSheetFromGoogle({hash, guildId, sheet})
    {
        let importedSheet = sheet;
        if(importedSheet && typeof importedSheet.toJSON === 'function')
        {
            importedSheet = importedSheet.toJSON();
        }

        if(!importedSheet || !Array.isArray(importedSheet.traits))
        {
            throw new Error('Imported sheet is invalid: expected a JSON sheet with a traits array');
        }

        // Normalize through model serialization so persisted imports always match the expected storage format.
        const normalizedSheet = (await KithainSheet.fromJSON(importedSheet)).toJSON();
        const sheetDocument = {digest:hash, guildId, nanoid:nanoid(), sheet:normalizedSheet};
        await this.collection.insertOne(sheetDocument);
        return sheetDocument.nanoid;
    }



    async getSheetByDigest(hash)
    {
        const loadedSheetsCollection = this.db.collection('loadedSheets');
        const sheet = await loadedSheetsCollection.findOne({hash});
        if(!sheet)
        {
            throw new Error("There is no sheet loaded for your account on this Server");
        }
        return await this.getSheetByHashAndNanoid({hash, nanoid:sheet.nanoid});
    }

    async getSheetByHashAndNanoid({hash, nanoid})
    {
        let sheet = this.objectCache.get(nanoid);
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
            this.objectCache.set(nanoid, sheet);
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
        const nanoid = (req.body?.nanoid ?? req.query?.nanoid ?? req.params?.nanoid ?? '').toString().trim();
        if(!nanoid)
        {
            throw new Error('Missing nanoid for save operation');
        }

        let targetNanoid = nanoid;
        let result = await this.collection.findOneAndUpdate(
            {nanoid:targetNanoid},
            {$set:{sheet:req.body.sheet}},
            {returnDocument:'after'}
        );

        if(!result.value)
        {
            const tempLinksCollection = this.db.collection('temporaryViewLinks');
            const tempLink = await tempLinksCollection.findOne({nanoid});
            if(tempLink && tempLink.expiresAt > Date.now())
            {
                targetNanoid = tempLink.sheetNanoid;
                result = await this.collection.findOneAndUpdate(
                    {nanoid:targetNanoid},
                    {$set:{sheet:req.body.sheet}},
                    {returnDocument:'after'}
                );
            }
        }

        if(!result)
        {
            res.status(404).json({error:'Sheet not found', nanoid});
            return;
        }

        res.status(200).json({status: 'saved', nanoid:targetNanoid});
    }

    static getInstance()
    {
        return super.getInstance(this);
    }

    get collection()
    {
        return this.db.collection('sheets');
    }

    async getQRCode(req, res)
    {
        const url = `${webPresence}/characters/${req.params.nanoid}/view`;
        const qrCode = await QRCode.toBuffer(url);
        res.setHeader('Content-Type', 'image/png');
        res.send(qrCode);
    }
}

export default SheetController;
