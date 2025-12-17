import userHash from "./inc/userHashFunction.js";
import {SlashCommandBuilder, MessageFlags} from 'discord.js';
import conf from '../../../conf.js';


export default({controller})=>({
    data: new SlashCommandBuilder()
        .setName('add-character')
        .setDescription("Add a new character to this server for you.")
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription("The name of the new character")
                .setRequired(true))
    ,
    async execute(interaction) {
        const hash = await userHash(interaction);
        const name = interaction.options.getString('name');

        controller.addSheet({hash, guildId:interaction.guildId, name}).then((result)=>{
            interaction.reply({content:`Your character ${name} has been added. They can be found at ${conf.frontend.url}/character/${result}/view`, flags: MessageFlags.Ephemeral});
        });
    },
});