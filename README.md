
Built by https://www.blackbox.ai

---

```markdown
# Telegram Chat Bot

A Telegram chatting bot with a web interface. This bot can interact with users via Telegram messaging, store messages in MongoDB, and respond to commands from admins. 

## Project Overview

This project is designed to be a Telegram bot that can handle basic interactions with users and store the messages for further analysis. It provides a web interface to showcase the bot's capabilities, such as starting a conversation and displaying help commands.

## Installation

To run this project locally, you will need Node.js and MongoDB installed on your machine. Follow the steps below:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd telegram-chat-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your environment variables**. Create a `.env` file in the root directory and add your configurations:
   ```
   TELEGRAM_TOKEN=YOUR_ACTUAL_TELEGRAM_TOKEN
   MONGODB_URI=YOUR_MONGODB_URI
   ADMIN_IDS=YourAdminUserIDsCommaSeparated
   NODE_ENV=development
   ```

## Usage

To start the project, use the following command:

```bash
npm start
```

For development purposes, you can also use:

```bash
npm run dev
```

Once the server is running, you can test the bot with Telegram using the commands:

- `/start`: Begin the conversation
- `/help`: Display available commands
- `/admin export`: Export all messages (only for admins)
- `/admin stats`: Show total number of messages (only for admins)

The web interface can be accessed via a web browser at `http://localhost:8000`.

## Features

- **Message Interaction**: Allows users to send messages, which the bot can echo back.
- **Admin Commands**: Special commands for admin users to handle data, such as exporting messages.
- **Persistent Storage**: Uses MongoDB for storing messages and metadata.
- **Web Interface**: A simple and visually appealing chat interface.

## Dependencies

This project uses the following dependencies (as specified in `package.json`):

- `axios`: ^1.8.4
- `body-parser`: ^1.20.3
- `dotenv`: ^16.4.7
- `express`: ^4.21.2
- `mongodb`: ^6.15.0
- `pg`: ^8.14.1
- `nodemon`: ^3.1.9 (dev dependency)

Run `npm install` to install these dependencies.

## Project Structure

The project structure is as follows:

```
telegram-chat-bot/
├── server.js               # Main server file
├── index.html              # Web interface
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Exact versions of installed dependencies
└── koyeb.yaml              # Deployment configuration for Koyeb
```

## Deployment

This project can be deployed on [Koyeb](https://koyeb.com/) using the `koyeb.yaml` configuration file provided. Make sure to replace sample values in the environment configuration with actual values required for your Telegram bot and database.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
```

This README provides a comprehensive guide for users to understand, install, and use the Telegram Chat Bot project.