import userHash from "./inc/userHashFunction.js";
import {SlashCommandBuilder, MessageFlags} from 'discord.js';
import conf from '../../../conf.js';


export default({controller})=>({
    data: new SlashCommandBuilder()
        .setName('get-share-link')
        .setDescription("Generate a share link for your character, all characters can be found with /show-characters.")
        .addStringOption(option =>
            option
                .setName('nanoid')
                .setDescription("The unique id of the pc to fetch")
                .setRequired(true))
    ,
    async execute(interaction) {
        try {
            const hash = await userHash(interaction);
            const nanoid = interaction.options.getString('nanoid');

            const sharedId = await controller.generateTemporaryViewLink(hash, nanoid);
            const content = `The share view for your web sheet can be found at ${conf.frontend.url}/characters/${sharedId}/share`;

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content, flags: MessageFlags.Ephemeral});
            } else {
                await interaction.reply({ content, flags: MessageFlags.Ephemeral});
            }

            console.log("response sent");
        }catch(err)
        {
            console.error(err);
            const errMsg = `You have no sheet on this server with that id`;
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errMsg, flags: MessageFlags.Ephemeral});
            } else {
                await interaction.reply({ content: errMsg, flags: MessageFlags.Ephemeral});
            }

        }

    },
});