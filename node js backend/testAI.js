
require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function testAI() {
    try {
        const response = await client.responses.create({
            model: "gpt-5.5",
            input: "Say hello! My AI application is connected."
        });

        console.log("OpenAI Connected Successfully!");
        console.log(response.output_text);

    } catch (error) {
        console.error("OpenAI Connection Failed:", error.message);
    }
}

testAI();
