import userHash from "./inc/userHashFunction.js";
import {SlashCommandBuilder, MessageFlags} from 'discord.js';



export default({controller})=>({
    data: new SlashCommandBuilder()
        .setName('load-character')
        .setDescription("Load a given character by its unique id, which can be found with /show-characters.")
        .addStringOption(option =>
            option
                .setName('nanoid')
                .setDescription("The unique id of the pc to fetch")
                .setRequired(true))
    ,
    async execute(interaction) {
        const hash = await userHash(interaction);
        const nanoid = interaction.options.getString('nanoid');

        controller.getSheetByHashAndNanoid({hash, nanoid}).then(data=>{
            interaction.reply({content:`The sheet for ${data.name} has been loaded as your current sheet`, flags: MessageFlags.Ephemeral});
        }).catch(_err=>{
            console.log(_err);
            interaction.reply({content:`Your have no sheet on this server with that id`, flags: MessageFlags.Ephemeral});
        });
    },
});