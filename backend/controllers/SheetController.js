import Controller from "./Controller.js";
import blankSheetSchema from "../schema/blankSheetSchema.js";

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

    async getBlankSheet(req, res)
    {
        const sheetStructure = blankSheetSchema;

        const xp = 0, cp = 0, fp = 0;

        const sheetJSON = {};

        sheetJSON.traits = [
            ...Object.entries(sheetStructure.attributes).flatMap(([group, list])=>
                list.map(name=>({type:'Attribute', name}))
            ),
            ...Object.entries(sheetStructure.abilities).flatMap(([group, list]) =>
                list.map(name => ({ type: group, name }))
            ),
            ...sheetStructure.arts.map(art=>({type:'Art', name:art})),
            ...sheetStructure.realms.map(realm => ({ type: 'Realm', name: realm }))
        ].map(trait => ({ ...trait, cp, xp, fp }));



        res.status(200).json(sheetJSON);
    }
}

export default SheetController;