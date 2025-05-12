
# Zscaler TAM Practice App

An interactive web app designed to help you prepare for Zscaler Technical Account Manager interviews. Features include:

- 🔁 Flashcards for technical topics
- 🎯 Q&A bank for situational and soft skills practice
- 🧠 Randomized quiz mode with category filters and answer review
- 📂 JSON-based content loading with file upload support

## 📁 File Structure

- `index.html` – main UI layout
- `style.css` – styles and layout
- `app.js` – JavaScript logic for deck handling, quiz, and navigation
- `questions.json` – quiz questions (up to 150 entries)
- `flashcards.json` – flashcard deck
- `qa.json` – interview prep questions

## 🚀 How to Use

### Local
1. Clone the repo or copy all files into a folder
2. Run a local server:

```bash
python -m http.server
```

3. Visit `http://localhost:8000` in your browser

### GitHub Pages
1. Push the project to a GitHub repo
2. Go to **Settings > Pages**, set source to `main` branch and root directory
3. Visit the published URL like `https://yourusername.github.io/your-repo`

## ✍️ Adding Content

You can edit or add your own content in:

- `flashcards.json` – for topic flashcards
- `qa.json` – for behavioral Q&A prep
- `questions.json` – for multiple-choice quizzes

Use the in-app file uploader or update these files directly.

## 🤝 Contributing

Feel free to fork and enhance the project. Ideas:
- Add score tracking or user login
- Upload multiple decks
- Export incorrect questions for review

## 📜 License

This app is open source and free to use for personal or educational use.
