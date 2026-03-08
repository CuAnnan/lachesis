import userHash from "./inc/userHashFunction.js";
import GoogleKithainSheet from "../../../Character Model/GoogleKithainSheet.js";
import pkg from 'discord.js';
import conf from '../../../conf.js';
const {SlashCommandBuilder, MessageFlags} = pkg;



export default({controller})=>({
    data: new SlashCommandBuilder()
        .setName('fetch-sheet')
        .setDescription("Load a character sheet from its google spreadsheet URL.")
        .addStringOption(option =>
            option
                .setName('URL')
                .setDescription("The URL of the sheet to fetch. This should be the published URL, which can be obtained by going to File > Publish to the web in Google Sheets.")
                .setRequired(true))
    ,
    async execute(interaction) {
        const hash = await userHash(interaction);
        const url = interaction.options.getString('url');
        let sheet = await GoogleKithainSheet.fromGoogleSheetsURL(url);
        controller.addSheetFromGoogle({hash, guildId:interaction.guildId, sheet}).then((result)=>{
            interaction.reply({content:`Your character ${sheet.name} has been added. They can be found at ${conf.frontend.url}/character/${result}/view`, flags: MessageFlags.Ephemeral});
        });
    },
});