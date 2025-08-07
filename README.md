# 🧠 AI-Powered Google Form & Data Generator

A minimalistic web app that lets users build custom forms and populate them with **synthetically generated, human-like data** using the **Gemini API**. Ideal for creating feedback samples, demo data, or testing datasets.

## 🚀 Features

- 🔧 Dynamic form builder (title, multiple questions)
- ✅ Supports question types: Short Answer, Paragraph, MCQ, Checkboxes, Dropdown
- 📤 Import options from CSV
- ✨ Generate realistic text responses using AI (Google Gemini)
- 💾 Save generated form structure as `.json` (locally)
- 🔗 Simple, clean Tailwind UI

---

## 🗂️ Project Structure

```
ai-form-generator/
├── public/
│   ├── index.html       # Frontend UI
│   ├── script.js        # Logic to build form, call AI API
│   └── style.css        # Optional extra styles (Tailwind-based)
├── server/
│   └── index.js         # Express backend (handles form save)
├── data/
│   └── sample.csv       # Example options input
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/ai-form-generator.git
cd ai-form-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Server

```bash
node server/index.js
```

Server will run at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Open the Frontend

You can open the `public/index.html` directly in your browser, or run a dev server:

```bash
npx live-server public
```

---

## 🔐 Google Gemini API Key

1. Go to [https://makersuite.google.com/app](https://makersuite.google.com/app)
2. Get your API key
3. Replace in `script.js`:

```js
const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
```

---

## 📝 Example CSV

`data/sample.csv`:

```csv
Excellent
Good
Average
Poor
Very Poor
```

---

## 📄 Output Example

When you click **"Generate Form"**, it saves a local file like:

```
data/form-1723108920392.json
```

Which contains the form structure (title, questions, and options).

---

## 📦 Future Improvements

- 🌍 Firebase or MongoDB form storage
- 🧪 Download form as HTML or Google Form API integration
- 📊 Preview responses in table/chart format

---

## 📃 License

MIT License

