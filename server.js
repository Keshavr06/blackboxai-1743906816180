require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// MongoDB configuration
let db;
const mongoUrl = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/telegrambot?retryWrites=true&w=majority';
const client = new MongoClient(mongoUrl);

(async () => {
  try {
    await client.connect();
    db = client.db('telegrambot');
    console.log('MongoDB connected');
    
    // Create indexes if they don't exist
    await db.collection('messages').createIndex({ chat_id: 1 });
    await db.collection('messages').createIndex({ created_at: 1 });
  } catch (err) {
    console.warn('MongoDB not available - running in limited mode');
    db = {
      collection: () => ({
        insertOne: () => Promise.resolve({ insertedId: null }),
        find: () => ({ toArray: () => Promise.resolve([]) })
      })
    };
  }
})();

// Close connection on process exit
process.on('SIGINT', async () => {
  await client.close();
  process.exit();
});

const app = express();
const PORT = process.env.PORT || 8000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(bodyParser.json());

// Health check endpoint for Koyeb
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle incoming Telegram updates
// Admin IDs from environment variables
const ADMINS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [];

app.post(`/webhook`, async (req, res) => {
  try {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;
    const isAdmin = ADMINS.includes(chatId.toString());

    // Store all messages
    await db.collection('messages').insertOne({
      chat_id: chatId,
      text: text,
      is_admin: isAdmin,
      created_at: new Date()
    });

    if (text === '/start') {
      await sendMessage(chatId, 'Welcome to the Telegram Chat Bot!');
    } 
    else if (text === '/help') {
      await sendMessage(chatId, 'Available commands:\n/start - Begin conversation\n/help - Show this help');
    }
    else if (text.startsWith('/admin') && isAdmin) {
      const command = text.split(' ')[1];
      if (command === 'export') {
        const messages = await db.collection('messages').find().toArray();
        await sendMessage(chatId, `Dataset (${messages.length} messages):\n${JSON.stringify(messages, null, 2)}`);
      }
      else if (command === 'stats') {
        const count = await db.collection('messages').countDocuments();
        await sendMessage(chatId, `Total messages collected: ${count}`);
      }
    }
    else {
      // Echo the message back with a slight delay
      setTimeout(async () => {
        await sendMessage(chatId, `You said: ${text}`);
      }, 1000);
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send();
  }
});

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: text
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode enabled');
  }
});