const mineflayer = require("mineflayer");
const { mineflayer: mineflayerViewer } = require("prismarine-viewer");

// Configuration
const config = {
  host: "paytwowin.falixsrv.me", // Server's IP address
  port: 42556, // Server's port
  username: "Darkbot", // Bot's username
  password: "NOOB@123X", // Bot's password
  auth: "offline", // Use 'offline' for non-premium servers
  version: "1.20.1", // Specify the Minecraft version here
  autoAuth: true, // Enable auto-authentication
  reconnectDelay: 5000, // Delay before reconnecting
  loginDelay: 500, // Delay before sending login commands
};

// Function to create the bot
function createBot() {
  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    auth: config.auth,
    version: config.version,
  });

  // Event listeners
  setupEventListeners(bot);

  return bot;
}

// Function to set up event listeners
function setupEventListeners(bot) {
  bot.once("spawn", () => {
    console.log("Bot has spawned!");
    mineflayerViewer(bot, { port: 3000, firstPerson: true }); // Start the viewer

    // Auto-login if enabled
    if (config.autoAuth) {
      setTimeout(() => {
        bot.chat(`/register ${config.password} ${config.password}`);
        bot.chat(`/login ${config.password}`);
        console.log("Auto-login commands executed.");
      }, config.loginDelay);
    }
  });

  bot.on("chat", (username, message) => {
    if (username === bot.username) return; // Ignore messages from the bot
    console.log(`<${username}> ${message}`);
  });

  bot.on("error", (err) => {
    console.error("Error:", err);
  });

  bot.on("end", () => {
    console.log("Bot has disconnected. Attempting to reconnect...");
    setTimeout(() => {
      createBot(); // Reconnect after a delay
    }, config.reconnectDelay);
  });
}

// Create the bot for the first time
createBot();
