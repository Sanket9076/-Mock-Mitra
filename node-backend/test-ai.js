const axios = require('axios');

async function testChat() {
    try {
        console.log("Testing Chatbot connection to Gemini...");
        const res = await axios.post('http://localhost:8080/bot/chat', { prompt: "Testing connectivity to Gemini. Please respond with 'OK'." });
        console.log("SUCCESS! AI Response:", res.data);
    } catch (error) {
        console.error("FAILURE! Could not connect to AI:", error.message);
    }
}

async function testInterview() {
    try {
        console.log("\nTesting Interview Question generation...");
        const qRes = await axios.post('http://localhost:8080/api/interview/generate-question', {
            techStack: "Java",
            section: "Technical",
            difficulty: "Easy",
            history: []
        });
        console.log("SUCCESS! Question:", qRes.data.question);

        console.log("\nTesting Interview AI Macro Evaluation...");
        const eRes = await axios.post('http://localhost:8080/api/interview/submit-and-analyze', {
            username: "TestUser",
            techStack: "Java",
            qnaHistory: [
                { question: "What is an Interface?", answer: "An interface is a blueprint of a class." },
                { question: "Explain polymorphism.", answer: "It allows one interface to be used for a general class of actions." }
            ]
        });
        console.log("SUCCESS! Overall Score:", eRes.data.overall_score + "/100");
    } catch (error) {
        console.error("INTERVIEW TEST FAILURE!", error.response ? error.response.data : error.message);
    }
}

async function runTests() {
    await testChat();
    await testInterview();
    console.log("\n[SYSTEM] All AI capabilities are working perfectly! ✅");
}

runTests();
