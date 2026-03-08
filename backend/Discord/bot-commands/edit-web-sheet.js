import { SlashCommandBuilder } from 'discord.js';
import userHash from "./inc/userHashFunction.js";
import conf from '../../../conf.js';

export default ({ controller }) => ({
    data: new SlashCommandBuilder()
        .setName('edit-web-sheet')
        .setDescription("Load a web sheet for editing, all characters can be found with /show-characters.")
        .addStringOption(option =>
            option
                .setName('nanoid')
                .setDescription("The unique id of the pc to fetch")
                .setRequired(true)
        ),
    async execute(interaction) {
        const hash = await userHash(interaction);
        const nanoid = interaction.options.getString('nanoid');

        try {
            await controller.getSheetByHashAndNanoid({ hash, nanoid });
            await interaction.reply({
                content: `Your web sheet can be found at ${conf.frontend.url}/characters/${nanoid}/edit`,
                ephemeral: true
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: `You have no sheet on this server with that id`,
                ephemeral: true
            });
        }

        console.log("response sent");
    },
});