import SheetController from "../backend/controllers/SheetController.js";
import MongoConnectionFactory from "../backend/inc/MongoConnectionFactory.js";
import conf from '../conf.js';


MongoConnectionFactory.init(conf).then(async () => {
    const blankSheet = SheetController.getBlankSheetDocument();
    const blankTraitsAsMap = Object.fromEntries(blankSheet.traits.map(trait=>[trait.name, trait]));

    const promises = [];

    const sheetCol = (await MongoConnectionFactory.getInstance()).collection("sheets");
    const sheetsCursor = sheetCol.find({});
    for await(const doc of sheetsCursor)
    {
        const {nanoid, sheet} = doc;
        const traits = Object.values({
            ...blankTraitsAsMap,
            ...Object.fromEntries(sheet.traits.map(trait=>[trait.name, trait]))
        });
        promises.push(sheetCol.updateOne({nanoid}, {$set:{"sheet.traits": traits}}));
    }

    Promise.all(promises).then(()=>{
        console.log("All updates run");
    });
});

