import userHash from "./inc/userHashFunction.js";
import {SlashCommandBuilder, MessageFlags} from 'discord.js';



export default({controller})=>({
    data: new SlashCommandBuilder()
        .setName('show-characters')
        .setDescription("Show the characters you have on this server")
    ,
    async execute(interaction) {
        console.log("Have command");
        const hashHex = await userHash(interaction);

        controller.getSheetsByHash(hashHex).then(sheets=>{
            let sheetsList  = "";
            for(const sheet of sheets)
            {
                sheetsList += `* ${sheet.sheet.name}: ${sheet.nanoid}\n`;
            }
            interaction.reply({content:`Your sheets on this server are\n${sheetsList}`, flags: MessageFlags.Ephemeral});
        }).catch(error=>{
            console.log(error);
            interaction.reply({content:`Your have no sheets on this server`, flags: MessageFlags.Ephemeral});
        });

        console.log("response sent");
    },
});