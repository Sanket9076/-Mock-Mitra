const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// --- DATA INITIALIZATION ---
const questionsPath = path.join(__dirname, 'data', 'questions.json');
let questionBank = { mern: [], backend: [], java: [], data_analyst: [] };

try {
    const data = fs.readFileSync(questionsPath, 'utf8');
    questionBank = JSON.parse(data);
    console.log("[Data] Question bank loaded successfully.");
} catch (err) {
    console.error("[Data] Failed to load question bank:", err.message);
}

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mock_mitra";
const JWT_SECRET = process.env.JWT_SECRET || "mock_mitra_secret_key_2024";

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
    .then(() => console.log("[MongoDB] Connected successfully to mock_mitra database."))
    .catch(err => console.error("[MongoDB] Connection error:", err));

// --- DATA MODELS ---

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const InterviewSchema = new mongoose.Schema({
    username: { type: String, required: true },
    techStack: String,
    overallScore: Number,
    qnaHistory: Array,
    finalReport: Object,
    date: { type: Date, default: Date.now }
});
const Interview = mongoose.model('Interview', InterviewSchema);

// --- NVIDIA NIM SETUP ---
const openai = new OpenAI({ 
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
});

const callAI = async (prompt, isJSON = false) => {
    try {
        const response = await openai.chat.completions.create({
            model: "meta/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            response_format: isJSON ? { type: "json_object" } : { type: "text" },
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("[NVIDIA] API Error:", error);
        throw error;
    }
};

const extractJSON = (text) => {
    try {
        const firstBracket = text.indexOf('{');
        const lastBracket = text.lastIndexOf('}');
        if (firstBracket === -1 || lastBracket === -1) return null;
        return JSON.parse(text.substring(firstBracket, lastBracket + 1));
    } catch (e) {
        console.error("[JSON Extraction] Failed:", e.message);
        return null;
    }
};

// --- AUTH ROUTES ---

app.post('/users/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.json({ msg: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- AI & INTERVIEW ROUTES ---

app.post('/bot/chat', async (req, res) => {
    const { prompt, history } = req.body;
    const system = "You are Mock Mitra AI, a professional technical interview assistant. Be concise, helpful, and encourage the user. History context:\n" + (history || "No previous history.");
    const userMessage = "\n\nUser: " + prompt + "\nAssistant:";

    try {
        const resultText = await callAI(system + userMessage);
        const cleanedResponse = resultText.replace(/^Assistant:\s*/i, '').replace(/^Bot:\s*/i, '').trim();
        res.send(cleanedResponse);
    } catch (e) { 
        console.error("Bot Error:", e);
        res.status(500).send("I'm experiencing a high volume of requests. Please try again in 30 seconds."); 
    }
});

app.post('/api/interview/generate-question', async (req, res) => {
    const { techStack, section, difficulty, history } = req.body;

    const getCategory = (stack) => {
        const s = stack.toLowerCase();
        if (s.includes('mern')) return 'mern';
        if (s.includes('node') || s.includes('back')) return 'backend';
        if (s.includes('java')) return 'java';
        if (s.includes('data')) return 'data_analyst';
        return null;
    };

    const category = getCategory(techStack);
    if (category && questionBank[category] && questionBank[category].length > 0) {
        const historyList = history || [];
        const available = questionBank[category].filter(q => !historyList.includes(q.question));
        if (available.length > 0) {
            const randomQ = available[Math.floor(Math.random() * available.length)];
            return res.json({
                section: section,
                difficulty: randomQ.level || difficulty,
                question: randomQ.question
            });
        }
    }

    const aiPrompt = `Act as an expert technical interviewer. Generate a ${difficulty} level interview question for a ${techStack} position, focusing on ${section}. 
    Previous questions asked (DO NOT REPEAT): ${JSON.stringify(history)}.
    Return ONLY JSON: {"section": "${section}", "difficulty": "${difficulty}", "question": ""}`;
    
    try {
        const rawText = await callAI(aiPrompt, true);
        res.json(JSON.parse(rawText));
    } catch (e) { 
        console.error("Question Gen Error:", e);
        res.json({ section, difficulty, question: `Describe a complex project you built using ${techStack}.` }); 
    }
});

app.post('/api/interview/submit-and-analyze', async (req, res) => {
    const { username, techStack, qnaHistory } = req.body;
    
    try {
        console.log("[Report] Generating final performance report for batch data...");

        // Save raw interview to DB immediately
        let newInterview = new Interview({ 
            username: username || 'Anonymous', 
            techStack, 
            overallScore: 0, 
            qnaHistory, 
            finalReport: null 
        });
        await newInterview.save();
        console.log(`[MongoDB] Initial save successful for user: ${newInterview.username} with ID: ${newInterview._id}`);

        const prompt = `### ROLE: THE MOCK MITRA TECHNICAL STRATEGIST
You are an elite, high-rigor Technical Interviewer. Evaluate this entire interview history based on pure logic, technical depth, and correctness. DO NOT rely on hardcoded benchmarks.

### INTERVIEW HISTORY (QUESTIONS & ANSWERS):
${JSON.stringify(qnaHistory)}

### EVALUATION LOGIC:
1. THE FLUFF FILTER: Ignore polite filler phrases. Only analyze the technical content. Identify factual errors (which result in severe score penalties).
2. MACRO EVALUATION: Evaluate the overall architecture of their answers. Identify the top gaps and strengths.
3. SCORING: Provide a strict, technical evaluation score out of 100 for communication, technical, confidence, and overall. Remember, timeouts and unanswered questions count as 0s.

### OUTPUT FORMAT (MANDATORY JSON ONLY):
{ 
  "overall_score": [0-100], 
  "metrics": { "communication": [0-100], "technical": [0-100], "confidence": [0-100], "overall": [0-100] },
  "section_analysis": [
    { "section_name": "Technical", "score": [0-100], "comments": "Provide a blunt, 2-sentence technical critique of their coding answers." },
    { "section_name": "Behavioral", "score": [0-100], "comments": "Critique on communication." }
  ], 
  "weak_areas": ["List gap 1", "List gap 2"], 
  "improvement_plan": ["Action 1", "Action 2"], 
  "personalized_tips": ["Tip 1", "Tip 2"] 
}`;

        const rawText = await callAI(prompt, true);
        const parsedData = extractJSON(rawText);
        
        if (parsedData) {
            console.log(`[Report] Final Score computed: ${parsedData.overall_score}`);
            
            // Update Database with final report
            newInterview.finalReport = parsedData;
            newInterview.overallScore = parsedData.overall_score;
            await newInterview.save();

            res.json(parsedData);
        } else {
            throw new Error("Failed to extract report JSON");
        }
    } catch (e) { 
        console.error("[Report] Generation Failed - AI Link Offline.", e);
        
        const fallbackReport = { 
            overall_score: 0, 
            metrics: { communication: 0, technical: 0, confidence: 0, overall: 0 },
            section_analysis: [{ section_name: "Technical", score: 0, comments: "Final report failed because the AI connection was unavailable." }],
            weak_areas: ["AI Link Offline. Detailed analysis unavailable."],
            improvement_plan: ["Please try submitting again."],
            personalized_tips: ["The AI encountered an issue generating your macro analysis."] 
        };
        
        // Ensure failed report is also saved
        try {
            await Interview.updateOne(
                { username: username || 'Anonymous' },
                { $set: { finalReport: fallbackReport } },
                { sort: { date: -1 } }
            );
            console.log("[MongoDB] Fallback report saved.");
        } catch(dbErr) {}

        res.json(fallbackReport); 
    }
});

// --- HISTORY SAVE ROUTE ---

app.post('/api/interview/save', async (req, res) => {
    try {
        const { username, techStack, overallScore, qnaHistory, finalReport } = req.body;
        const newInterview = new Interview({ username, techStack, overallScore, qnaHistory, finalReport });
        await newInterview.save();
        res.json({ msg: "Interview history saved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/interview/history/:username', async (req, res) => {
    try {
        const interviews = await Interview.find({ username: req.params.username }).sort({ date: -1 });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[Mock Mitra] Consolidated Backend running on http://localhost:${PORT}`);
});
