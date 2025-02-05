# Gaianet AI Chat Bot

This repository contains tools for running a Gaianet Node and an automated AI chat bot that interacts with Gaianet's AI API.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Quick Start

### 1. Gaianet Node Setup

> ⚠️ **Important:** Before using this bot, make sure you have completed the Gaianet Node setup by following the official documentation at [https://docs.gaianet.ai/getting-started/quick-start/](https://docs.gaianet.ai/getting-started/quick-start/)

Quick reference for node setup (after following the documentation):
```bash
# Initialize node
gaianet init

# Start node
gaianet start

# Get your Device ID and Node ID
gaianet info
```

### 2. AI Chat Bot Setup

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment:
Create `.env` file with:
```env
API_KEY=your-gaianet-api-key
API_BASE_URL=https://llama.gaia.domains/v1/chat/completions
```

4. Add your prompts:
Edit `messages.txt` with your desired prompts (one per line)

5. Run the bot:
```bash
npm start
```

## Configuration

- `.env`: API configuration
- `messages.txt`: List of prompts for the AI
- `MAX_RETRIES`: 3 attempts per request
- `TIMEOUT`: 30 seconds per request

## Features

- Automated AI interactions
- Retry mechanism with exponential backoff
- Error handling
- Rate limiting protection
- Continuous prompt cycling

## Uninstallation

To remove Gaianet Node:
```bash
# Stop the node
gaianet stop

# Uninstall
curl -sSfL 'https://github.com/GaiaNet-AI/gaianet-node/releases/latest/download/uninstall.sh' | bash
```

## Donations
If you would like to support the development of this project, you can make a donation using the following addresses:


- **Solana**: `AyqspD9yMBWNTq7jv8dUx9YLgvctsaGdVGN8oGmZn2np`
- **EVM**: `0xFFc3448Fb50d9B053e7Ae03B72f45c85fC0EfC56`

## License

[MIT License](./LICENSE)


