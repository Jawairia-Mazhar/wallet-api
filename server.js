require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Wallet API is alive');
});

const prisma = require('./config/prisma');

app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: 'DB connected', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'DB connection failed' });
  }
});
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const accountRoutes = require('./routes/accountRoutes');
app.use('/api/accounts', accountRoutes);

app.listen(process.env.PORT || 5000, () => console.log('Server running'));