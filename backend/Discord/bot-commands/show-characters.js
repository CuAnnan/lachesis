import pkg from 'discord.js';
const { SlashCommandBuilder, InteractionResponseFlags } = pkg;
import userHash from "./inc/userHashFunction.js";

const flags = InteractionResponseFlags.Ephemeral;


export default ({ controller }) => ({
    data: new SlashCommandBuilder()
        .setName('show-characters')
        .setDescription("Show the characters you have on this server"),
    async execute(interaction) {
        try {
            const hashHex = await userHash(interaction);
            const sheets = await controller.getSheetsByHash(hashHex);

            if (!sheets || sheets.length === 0) {
                await interaction.reply({
                    content: "You have no sheets on this server",
                    flags
                });
                return;
            }

            const sheetsList = sheets
                .map(sheet => `* ${sheet.sheet.name}: ${sheet.nanoid}`)
                .join("\n");

            await interaction.reply({
                content: `Your sheets on this server are\n${sheetsList}`,
                flags
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "You have no sheets on this server",
                flags
            });
        }
    },
});