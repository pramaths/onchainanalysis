const request = require('supertest');
const { createServer } = require('http');
const express = require('express');
const { getAllTransactionsControllers } = require('../../controllers/btc/transactionController');

// Setup an express app as usual
const app = express();
app.get('/trace/:address', getAllTransactionsControllers);

// Creating a server from app for supertest
const server = createServer(app);

// Write your test
describe('Transaction streaming controller', () => {
    test('Stream should send multiple data events and then close', async () => {
        const address = 'bc1qhg7fpzxl68m2g5l0ane9h9akw4hfnh2s8hn3gm';
        const agent = request.agent(server);

        const response = await agent.get(`/trace/${address}`);

        expect(response.headers['content-type']).toBe('text/event-stream');
        expect(response.status).toBe(200);

        // Check if the data events and close event are sent properly
        const events = response.text.trim().split('\n\n')
    .map(line => {
        if (line.startsWith('data: ')) {
            try {
                return JSON.parse(line.substring(5));
            } catch (err) {
                console.error("Failed to parse event data", err);
                return null;
            }
        }
        return null;
    })
    .filter(event => event !== null);
        const raw=response.text
        console.log("Raw response:",raw);
        console.log("Event received:", events);

        expect(events).toContainEqual({ type: 'info', message: expect.any(String) });
        expect(events).toContainEqual({ type: 'close', message: 'Stream completed' });
        // console.log(events[events.length - 1].type);    
        if (events.length > 0) {
            expect(events[events.length - 1].type).toBe('close');
        } else {
            // Fail the test if no events were received
            throw new Error("No events received during the stream.");
        }
    },10000000);

    afterAll(() => {
        server.close(); // Close the server after the tests
    });
});
