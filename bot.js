const express = require("express");
const bodyParser = require("body-parser");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const app = express();
const PORT = 3000;

const tokens = [
    "", // añade tus tokens aquí

];

const bots = tokens.map(token => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  client.login(token);
  client.once("ready", () => {
    console.log(`Conectado como: ${client.user.tag}`);
  });

  return client;
});

app.use(bodyParser.json());
app.use(express.static("public"));

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post("/api/enviar", async (req, res) => {
  const { peticion, userId } = req.body;

  if (!peticion || !userId) {
    return res.status(400).send("Faltan datos.");
  }

  try {
    async function enviarMensajes(bot) {
      const user = await bot.users.fetch(userId);
      for (let i = 0; i < 100; i++) {
        await user.send(peticion);
        await delay(10);
      }
    }
    await Promise.all(bots.map(bot => enviarMensajes(bot)));

    res.send("¡Se enviaron los mensajes simultáneamente desde los bots!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al enviar mensajes. ¿ID correcto?");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web activo en: http://localhost:${PORT}`);
});
