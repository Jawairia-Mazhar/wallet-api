require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Wallet API is alive');
});

app.listen(process.env.PORT || 5000, () => console.log('Server running'));