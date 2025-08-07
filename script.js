// Configuration
const GEMINI_API_KEY = "AIzaSyD0zxqtlA2CZw-8BiUbQO2XKHw6G9GeFgI"; // Your Gemini API key
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkwMu-Yu9IvRltWaCxz4qMUxt5pQIIeGufozbaZnmR0qrTPggNv0-LuzsLLMaHMJD-/exec"; // Your deployed Apps Script URL

// Add a new question block to the UI
function addQuestion() {
    const container = document.getElementById("questionsContainer");
    const questionDiv = document.createElement("div");
    questionDiv.className = "question bg-white p-3 border rounded shadow mb-4";

    questionDiv.innerHTML = `
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">Question Title</label>
            <input type="text" class="question-title mt-1 p-2 w-full border rounded" placeholder="Enter question title" required>
        </div>
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">Question Type</label>
            <select class="question-type mt-1 p-2 w-full border rounded">
                <option value="SHORT_ANSWER">Short Answer</option>
                <option value="PARAGRAPH">Paragraph</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="CHECKBOXES">Checkboxes</option>
                <option value="DROPDOWN">Dropdown</option>
            </select>
        </div>
        <div class="mb-2 options-container">
            <label class="block text-sm font-medium text-gray-700">Options (for choice-based questions)</label>
            <textarea class="options mt-1 p-2 w-full border rounded" placeholder="Enter options (one per line)"></textarea>
            <input type="file" class="csv-upload mt-2" accept=".csv">
        </div>
        <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">Generate AI Responses (for text fields)</label>
            <input type="number" class="ai-count mt-1 p-2 w-20 border rounded" placeholder="Count" min="1">
            <button type="button" class="generate-ai bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-2">Generate with AI</button>
        </div>
        <button type="button" class="remove-question bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2">Remove Question</button>
    `;

    // CSV Upload handler
    questionDiv.querySelector(".csv-upload").addEventListener("change", (e) => {
        const file = e.target.files[0];
        const textarea = questionDiv.querySelector(".options");
        if (file) parseCSV(file, textarea);
    });

    // Generate AI responses handler
    questionDiv.querySelector(".generate-ai").addEventListener("click", () => generateAIResponses(questionDiv));

    // Remove question block handler
    questionDiv.querySelector(".remove-question").addEventListener("click", () => questionDiv.remove());

    container.appendChild(questionDiv);
}

// Parse CSV and populate textarea
function parseCSV(file, textarea) {
    Papa.parse(file, {
        complete: (results) => {
            const options = results.data.map(row => row[0]).filter(Boolean).join("\n");
            textarea.value = options;
        },
        header: false,
        skipEmptyLines: true
    });
}

// Generate AI responses using Gemini API
async function generateAIResponses(questionDiv) {
    const questionTitle = questionDiv.querySelector(".question-title").value.trim();
    const questionType = questionDiv.querySelector(".question-type").value;
    const count = parseInt(questionDiv.querySelector(".ai-count").value) || 5;
    const resultDiv = document.getElementById("result");

    if (!questionTitle) {
        resultDiv.innerHTML = `<p class="text-red-500">❗ Please enter a question title before generating responses.</p>`;
        return;
    }

    resultDiv.innerHTML = `<p class="text-blue-500">⏳ Generating AI responses...</p>`;

    try {
        const prompt = `Generate ${count} realistic responses for the question: "${questionTitle}" in ${questionType.toLowerCase().replace("_", " ")} format. Return as a plain JSON array, e.g., ["response1","response2"].`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0]) {
            throw new Error("No valid AI response found.");
        }

        let rawText = data.candidates[0].content.parts[0].text.trim();
        rawText = rawText.replace(/```json|```/g, "").trim();

        const aiResponses = JSON.parse(rawText);
        questionDiv.querySelector(".options").value = aiResponses.join("\n");

        resultDiv.innerHTML = `<p class="text-green-500">✅ Successfully generated ${aiResponses.length} AI responses.</p>`;
    } catch (error) {
        console.error("AI response error:", error);
        resultDiv.innerHTML = `<p class="text-red-500">❌ Error generating AI responses: ${error.message}</p>`;
    }
}

// Generate Google Form using Apps Script
async function generateForm() {
    const formTitle = document.getElementById("formTitle").value.trim();
    const resultDiv = document.getElementById("result");
    const questionDivs = document.querySelectorAll(".question");

    if (!formTitle) {
        resultDiv.innerHTML = `<p class="text-red-500">❗ Please provide a form title.</p>`;
        return;
    }
    if (questionDivs.length === 0) {
        resultDiv.innerHTML = `<p class="text-red-500">❗ Please add at least one question.</p>`;
        return;
    }

    const questions = Array.from(questionDivs).map(q => {
        const title = q.querySelector(".question-title").value.trim();
        const type = q.querySelector(".question-type").value;
        const options = q.querySelector(".options").value.split("\n").map(opt => opt.trim()).filter(Boolean);
        return { title, type, options };
    });

    if (questions.some(q => !q.title)) {
        resultDiv.innerHTML = `<p class="text-red-500">❗ All questions must have a title.</p>`;
        return;
    }

    resultDiv.innerHTML = `<p class="text-blue-500">⏳ Creating Google Form...</p>`;

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: formTitle, questions })
        });

        const data = await response.json();
        if (data.status === "success") {
            resultDiv.innerHTML = `
                <p class="text-green-500">✅ Form created successfully!<br>
                <a href="${data.url}" target="_blank" class="underline text-blue-600">Open Google Form</a></p>`;
        } else {
            throw new Error(data.message || "Unknown error creating form.");
        }
    } catch (error) {
        console.error("Form creation error:", error);
        resultDiv.innerHTML = `<p class="text-red-500">❌ Error creating form: ${error.message}</p>`;
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    addQuestion();
    document.getElementById("addQuestionBtn").addEventListener("click", addQuestion);
    document.getElementById("generateFormBtn").addEventListener("click", generateForm);
});
