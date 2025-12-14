import userHash from "./inc/userHashFunction.js";
import {SlashCommandBuilder, MessageFlags} from 'discord.js';
import conf from '../../../conf.js';


export default({controller})=>({
    data: new SlashCommandBuilder()
        .setName('get-web-sheet')
        .setDescription("Load a web sheet for vieiwing, all characters can be found with /show-characters.")
        .addStringOption(option =>
            option
                .setName('nanoid')
                .setDescription("The unique id of the pc to fetch")
                .setRequired(true))
    ,
    async execute(interaction) {
        const hash = await userHash(interaction);
        const nanoid = interaction.options.getString('nanoid');

        controller.getSheetByHashAndNanoid({hash, nanoid}).then(()=>{
            interaction.reply({content:`Your web sheet can be found at ${conf.frontend.url}/characters/${nanoid}/view`, flags: MessageFlags.Ephemeral});
        }).catch(_err=>{
            console.log(_err);
            interaction.reply({content:`Your have no sheet on this server with that id`, flags: MessageFlags.Ephemeral});
        });

        console.log("response sent");
    },
});