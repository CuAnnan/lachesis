import pkg from 'discord.js';
const { SlashCommandBuilder } = pkg;

import userHash from "./inc/userHashFunction.js";
import GoogleKithainSheet from "../../../Character Model/GoogleKithainSheet.js";
import conf from '../../../conf.js';

export default ({ controller }) => ({
    data: new SlashCommandBuilder()
        .setName('fetch-sheet')
        .setDescription("Load a character sheet from its Google spreadsheet URL.")
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription("The URL of the sheet to fetch. Use File > Publish to the web in Google Sheets.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const hash = await userHash(interaction);
        const url = interaction.options.getString('url');

        try {
            await interaction.deferReply({ ephemeral: true });

            const sheet = await GoogleKithainSheet.fromGoogleSheetsURL(url);
            const result = await controller.addSheetFromGoogle({ hash, guildId: interaction.guildId, sheet });

            await interaction.editReply({
                content: `Your character ${sheet.name} has been added. They can be found at ${conf.frontend.url}/character/${result}/view`
            });
        } catch (err) {
            console.error(err);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'An error occurred while fetching the sheet.',
                });
            } else {
                await interaction.reply({
                    content: 'An error occurred while fetching the sheet.',
                    ephemeral: true,
                });
            }
        }
    },
});