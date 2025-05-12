// === Zscaler TAM App - app.js ===

// Load decks (flashcards and Q&A) from external JSON files
let decks = { flashcards: [], qa: [] };

// Helper function to remove the loading message
function removeLoadingMessage() {
  const loadingMsg = document.getElementById('loadingMsg');
  if (loadingMsg) loadingMsg.remove();
}

fetch('flashcards.json')
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("✅ Loaded flashcards:", data);
  })
  .catch(err => {
    console.error('Error loading flashcards:', err);
    alert('❌ Failed to load flashcards. Please check flashcards.json.');
  });

// Fetch flashcards from flashcards.json
/* fetch('flashcards.json')
  .then(res => res.json())
  .then(data => {
    console.log("✅ Loaded flashcards:", data.length);
    if (data.length === 0) {
      alert('⚠️ Flashcards loaded but empty!');
    } else if (!data.every(card => card.front && card.back)) {
      alert('⚠️ Invalid flashcard format detected!');
      return;
    }
    removeLoadingMessage();
    decks.flashcards = data;
    if (currentDeck === 'flashcard') showCard();
  })
  .catch(err => {
    console.error('Error loading flashcards:', err);
    alert('❌ Failed to load flashcards. Please check flashcards.json.');
  }); */

// Fetch Q&A cards from qa.json
fetch('qa.json')
  .then(res => res.json())
  .then(data => {
    console.log("✅ Loaded QA cards:", data.length);
    if (data.length === 0) alert('⚠️ QA cards loaded but empty!');
    if (document.getElementById('loadingMsg')) document.getElementById('loadingMsg').remove(); decks.qa = data; })
  .catch(err => console.error('Error loading QA deck:', err));

// Load quiz questions from external JSON file
let allQuestions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    console.log("✅ Loaded questions:", allQuestions.length);
    if (allQuestions.length < 20) alert('⚠️ Less than 20 questions loaded — quiz will be limited.');
    if (document.getElementById('loadingMsg')) document.getElementById('loadingMsg').remove();
    console.log("✅ Loaded questions:", allQuestions.length);
  })
  .catch(err => {
    console.error('Failed to load questions:', err);
    alert('Unable to load quiz questions. Please check questions.json.');
  });

// State variables
let quizQuestions = [], quizIndex = 0, score = 0, mode = 'flashcard', currentDeck = 'qa', currentIndex = 0;
let reviewAnswers = [];

// Display current flashcard or Q&A item
function showCard() {
  const deck = decks[currentDeck];
  if (!deck || deck.length === 0) {
    document.getElementById("cardFront").textContent = "No flashcards available.";
    document.getElementById("cardBack").textContent = "Please add more cards to this deck.";
    return;
  }
  const card = deck[currentIndex];
  document.getElementById("cardFront").textContent = card.front;
  document.getElementById("cardBack").textContent = card.back;
  document.getElementById("cardBack").style.display = "none";
}

// Toggle back of card on click
function toggleCard() {
  if (mode !== 'flashcard' && mode !== 'qa') return;
  const back = document.getElementById("cardBack");
  back.style.display = back.style.display === "none" ? "block" : "none";
}

// Go to next flashcard/Q&A item
function nextCard() {
  currentIndex = (currentIndex + 1) % decks[currentDeck].length;
  showCard();
}

// Go to previous flashcard/Q&A item
function prevCard() {
  currentIndex = (currentIndex - 1 + decks[currentDeck].length) % decks[currentDeck].length;
  showCard();
}

// Switch between flashcards, Q&A, and quiz modes
function setMode(newMode) {
  mode = newMode;
  document.getElementById("flashcard").style.display = (mode === 'flashcard' || mode === 'qa') ? 'block' : 'none';
  document.getElementById("quiz").style.display = 'none';
  if (mode === 'flashcard' || mode === 'qa') {
    currentDeck = mode;
    currentIndex = 0;
    showCard();
  }
}

// Start a quiz session based on selected category
function startQuiz() {
  mode = 'quiz';
  score = 0;
  quizIndex = 0;
  const category = document.getElementById("categorySelect").value;
  const filtered = category === 'All' ? allQuestions : allQuestions.filter(q => q.category === category);
  quizQuestions = filtered.sort(() => 0.5 - Math.random()).slice(0, 20); // Pull 20 random questions
  reviewAnswers = [];
  document.getElementById("flashcard").style.display = 'none';
  document.getElementById("quiz").style.display = 'block';
  showQuiz();
}

// Show current quiz question
function showQuiz() {
  if (quizIndex >= quizQuestions.length) {
    // End of quiz - show review
    let summary = `Test complete! Final score: ${score}/${quizQuestions.length}`;
    let reviewHtml = '<h3>Review:</h3>';
    reviewAnswers.forEach((item, i) => {
      reviewHtml += `<div><strong>Q${i+1}:</strong> ${item.question}<br>` +
                     `<span style='color:${item.selected === item.correct ? "green" : "red"}'>Your answer: ${item.selected}</span><br>` +
                     `Correct answer: ${item.correct}</div><br>`;
    });
    document.getElementById("quizQuestion").innerHTML = summary + "<br><br>" + reviewHtml;
    document.getElementById("quizOptions").innerHTML = '';
    return;
  }
  const q = quizQuestions[quizIndex];
  document.getElementById("quizQuestion").textContent = q.question;
  const optionsDiv = document.getElementById("quizOptions");
  optionsDiv.innerHTML = '';
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
  updateScoreBoard();
}

// Check selected answer and update score
function checkAnswer(selected) {
  reviewAnswers.push({
    question: quizQuestions[quizIndex].question,
    selected: selected,
    correct: quizQuestions[quizIndex].answer
  });
  if (selected === quizQuestions[quizIndex].answer) score++;
  quizIndex++;
  showQuiz();
}

// Handle file upload and assign to appropriate deck
function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const deckType = file.name.includes("flashcard") ? "flashcards" : file.name.includes("qa") ? "qa" : null;
      if (deckType) {
        decks[deckType] = data;
        alert(`${deckType} deck loaded from file.`);
        currentDeck = deckType;
        showCard();
      } else {
        alert("Unrecognized file type. Use flashcards.json or qa.json");
      }
    } catch (err) {
      alert("Failed to parse JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Update quiz progress display
function updateScoreBoard() {
  document.getElementById("scoreBoard").textContent = `Score: ${score}/${quizIndex}`;
}

// File upload functionality for loading local JSON decks
document.addEventListener("DOMContentLoaded", () => {
  const loadingMsg = document.createElement('div');
  loadingMsg.id = 'loadingMsg';
  loadingMsg.textContent = 'Loading decks...';
  loadingMsg.style = 'position:fixed;top:10px;left:10px;background:#fff3cd;padding:8px 12px;border:1px solid #ffeeba;border-radius:4px;color:#856404;font-weight:bold;z-index:9999';
  document.body.appendChild(loadingMsg);
  currentDeck = 'flashcard';
  mode = 'flashcard';
  setMode('flashcard');
  const uploadInput = document.getElementById("uploadDeck");
  if (uploadInput) {
    uploadInput.addEventListener("change", handleFileUpload);
  }
  if (decks[currentDeck] && decks[currentDeck].length > 0) {
    showCard();
  }
});
