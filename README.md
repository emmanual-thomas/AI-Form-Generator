# 🧠 AI-Powered Google Form & Data Generator

A lightweight web app that allows users to **build customizable forms** and populate them with **realistic AI-generated data** using the **Google Gemini API**. Once the form is built, it is automatically created in the user's **Google Drive** via a **Google Apps Script backend**.

---

## 🚀 Features

- 🔧 **Form Builder**: Create forms dynamically with various question types.
- ✅ **Supported Types**:
  - Short Answer
  - Paragraph
  - Multiple Choice
  - Checkboxes
  - Dropdown
- 📤 **Option Import**:
  - Manual Entry
  - CSV Upload
- 🤖 **AI-Generated Responses**:
  - Uses Google Gemini (v2.5 Flash) to generate realistic form responses.
- 📄 **Google Form Creation**:
  - Sends structured data to a deployed Apps Script backend to create actual Google Forms.
- 🧼 Clean and responsive UI using Tailwind CSS.

---

## 📁 Project Structure

```
AI-FORM-GENERATOR/
├── .gitignore
├── Code.gs               # Google Apps Script to generate the form in Drive
├── index.html            # Frontend (UI + layout)
├── README.md             # You're here!
├── sample.csv            # Sample CSV for uploading options
├── script.js             # All client-side logic & API integration
├── styles.css            # Tailwind custom styles (if any)
```

---

## 🛠️ Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/your-username/ai-form-generator.git
cd ai-form-generator
```

### 2. Open `index.html` directly in your browser

You can use Live Server in VS Code for auto reload:

```bash
npx live-server
```

---

## 🔑 Configuration

### 1. Gemini API

- Visit [https://makersuite.google.com/app](https://makersuite.google.com/app) and generate your **Gemini API key**.
- Replace the placeholder in `script.js`:
```js
const GEMINI_API_KEY = "YOUR_ACTUAL_API_KEY";
```

### 2. Google Apps Script

- Open `Code.gs` in [https://script.google.com](https://script.google.com).
- Paste the code, click `Deploy > Manage Deployments > New Deployment`:
  - Select **Web App**
  - **Execute as**: Me
  - **Access**: Anyone
- Copy the generated Web App URL and paste it into `script.js`:
```js
const APPS_SCRIPT_URL = "YOUR_DEPLOYED_SCRIPT_URL";
```

---

## 📤 Using CSV Upload

- For choice-based questions (MCQ, Dropdown, Checkboxes), upload a CSV file.
- CSV must have **one option per row** (only 1 column).

Example `sample.csv`:
```csv
Excellent
Good
Average
Poor
Very Poor
```

---

## ✨ Example Usage

1. Enter a form title.
2. Add one or more questions.
3. Choose a type and add options (via textarea or CSV).
4. (Optional) Use **"Generate with AI"** for auto-generated responses.
5. Click **Generate Form**.
6. You'll get a success link to your live Google Form.

---

## 🧪 Sample Prompt Sent to Gemini

```text
Generate 5 realistic responses for the question: "What was your favorite session in the workshop?" in paragraph format. Return as a plain JSON array, e.g., ["response1","response2"]
```

---

## ✅ To-Do & Improvements

- [ ] Add real-time form preview
- [ ] Save forms locally (offline version)
- [ ] Export to HTML or PDF
- [ ] Admin dashboard to manage generated forms

---

## 📄 License

MIT License
