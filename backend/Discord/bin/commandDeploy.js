// deploy-commands.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'discord.js';
import conf from '../../../conf.js'; // adjust if needed

const { discord } = conf;
const { clientId, token } = discord;
const { REST, Routes } = pkg;

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log({ clientId, token });

// Array to hold command data
const commands = [];

// Read all command files from the bot-commands folder
const commandsDir = path.join(__dirname, '/Discord/bot-commands');
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

// Dynamically import each command module
for (const file of commandFiles) {
    const modulePath = path.join(commandsDir, file);
    const module = await import(modulePath);
    const command = module.default({});
    if (command && command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
    }
}

// Create REST instance and set token
const rest = new REST().setToken(token);

// Deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
})();