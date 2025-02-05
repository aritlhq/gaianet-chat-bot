import { displayBanner } from './banner.js';
import fs from 'fs/promises';
import axios from 'axios';
import 'dotenv/config';

displayBanner();

const LOG_PREFIX = '[Gaianet]';
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // Increase timeout to 30 seconds

class GaianetBot {
    constructor() {
        this.messages = [];
        this.currentIndex = 0;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_BASE_URL;
    }

    async initialize() {
        try {
            // Validate environment variables
            if (!this.apiKey || !this.apiUrl) {
                throw new Error('API_KEY or API_BASE_URL not found in .env');
            }

            // Read messages from file
            const messageData = await fs.readFile('messages.txt', 'utf8');
            this.messages = messageData
                .split('\n')
                .map(msg => msg.trim())
                .filter(msg => msg);

            if (this.messages.length === 0) {
                throw new Error('No messages found in messages.txt');
            }

            console.log(`Loaded ${this.messages.length} messages successfully.`);
        } catch (error) {
            console.error('Initialization error:', error.message);
            process.exit(1);
        }
    }

    async sendRequest(message, retryCount = 0) {
        try {
            console.log(`${LOG_PREFIX} Sending request (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
            
            const response = await axios({
                method: 'post',
                url: this.apiUrl,
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: message }
                    ]
                },
                timeout: TIMEOUT
            });

            return response.data;
        } catch (error) {
            const status = error.response?.status;
            const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
            
            if (retryCount < MAX_RETRIES - 1 && (isTimeout || status === 404 || status === 502 || status === 504)) {
                const delay = Math.pow(2, retryCount) * 5000; // Exponential backoff
                console.log(`${LOG_PREFIX} Request failed. Retrying in ${delay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.sendRequest(message, retryCount + 1);
            }

            console.error(`${LOG_PREFIX} Error with message "${message}":`, 
                         error.response?.data?.error || error.message);
            return null;
        }
    }

    async processNextMessage() {
        if (this.currentIndex >= this.messages.length) {
            console.log(`${LOG_PREFIX} All messages processed. Starting over...`);
            this.currentIndex = 0;
            // Add longer delay between cycles
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        const message = this.messages[this.currentIndex];
        console.log(`\n${LOG_PREFIX} [${this.currentIndex + 1}/${this.messages.length}] Processing: ${message}`);

        const response = await this.sendRequest(message);
        if (response?.choices?.[0]?.message) {
            console.log(`${LOG_PREFIX} Response:`, response.choices[0].message.content);
        }

        this.currentIndex++;
        
        // Increased delay between requests
        const delay = 5000; // 5 seconds between requests
        console.log(`${LOG_PREFIX} Waiting ${delay/1000}s before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async start() {
        await this.initialize();
        console.log('Starting AI interaction...');
        
        while (true) {
            await this.processNextMessage();
        }
    }
}

// Start the bot
const bot = new GaianetBot();
bot.start().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nGracefully shutting down...');
    process.exit(0);
});
