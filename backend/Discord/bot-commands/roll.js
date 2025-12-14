import {SlashCommandBuilder, MessageFlags} from 'discord.js';


import userHash from "./inc/userHashFunction.js";
import rollParser from "./inc/poolParser.js";

let helpText = '***roll syntax***\n\n\
`/roll <n>` This will roll <n> dice. Eg. `/roll 6` will roll 6 dice\n\
`/roll <Trait>` + <Trait>[ + <Trait>....] This will roll a pool of dice made up of the values of the given traits. eg. `/roll Perception + Kenning` will roll your pool for Perception + Kenning.\n\
`/roll <Pool> vs <diff>` this allows you to specify what difficulty to roll a pool at. If no difficulty is provided, the difficulty will be 6';


export default({controller, DiceRoll})=> ({
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription("Roll some dice")
        .addStringOption(option =>
            option
                .setName('pool')
                .setDescription("The pool to roll. For syntax just enter help")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('modifiers')
                .setDescription('A space separated list of modifiers. "wi" or "willpower", "wy" or "wyrd", "spec" or "specialty"'))
    ,
    async execute(interaction) {

        console.log("roll command");

        let poolData = null;

        console.log("Parsing roll");
        let {parts, diff, mods} = rollParser(interaction, helpText);
        console.log(parts, diff, mods);


        if(Number.isNaN(parseInt(parts)))
        {
            diff = diff?parseInt(diff):6;
            let poolArray = parts.split('+');

            let poolParts = [];
            for(let part of poolArray)
            {
                poolParts.push(part.trim());
            }

            try
            {
                let hashHex = await userHash(interaction);
                let sheet = await controller.getSheetByDigest(hashHex);
                poolData = sheet.getPool(poolParts);
            }
            catch(e)
            {
                console.log(e);
                console.log(e.message);
                await interaction.reply({content:e.message, flags: MessageFlags.Ephemeral});
                return;
            }
        }
        else
        {
            poolData = {traits: [parts], dicePool:parseInt(parts)};
        }

        let pool = Object.assign({}, poolData, mods)
        pool.diff = diff;
        let roll = new DiceRoll(pool);
        if(roll.dicePool >= 100)
        {
            await interaction.reply({content:'Your dice cup runneth over.', flags: MessageFlags.Ephemeral});
            return;
        }

        let result = roll.resolve();
        let dice = result.faces.sort((a,b)=>a-b).map((x)=>x === 1?`__*${x}*__`:(x >= roll.diff?`**${x}**`:x));

        interaction.reply({content:`**Pool:** ${roll.traits.join(' + ')}\n**Difficulty:** ${roll.diff}\n**Result:** ${result.result}\n**Dice:** ${dice.join(" ")}\n**Successes:** ${result.successes}`});
    },
});