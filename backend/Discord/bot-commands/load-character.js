import pkg from 'discord.js';
const { SlashCommandBuilder, InteractionResponseFlags } = pkg;

import userHash from "./inc/userHashFunction.js";

const flags = InteractionResponseFlags.Ephemeral;


export default ({ controller }) => ({
    data: new SlashCommandBuilder()
        .setName('load-character')
        .setDescription("Load a given character by its unique id, which can be found with /show-characters.")
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
            const data = await controller.getSheetByHashAndNanoid({ hash, nanoid });
            await interaction.reply({
                content: `The sheet for ${data.name} has been loaded as your current sheet`,
                flags
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: `You have no sheet on this server with that id`,
                flags
            });
        }
    },
});