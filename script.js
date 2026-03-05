const questionBank = [
  {
    id: 1,
    category: "Math",
    question: "What is 12 × 8?",
    options: ["86", "96", "108", "88"],
    answerIndex: 1,
  },
  {
    id: 2,
    category: "Science",
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answerIndex: 1,
  },
  {
    id: 3,
    category: "History",
    question: "Who built the pyramids of Giza?",
    options: ["Romans", "Ancient Egyptians", "Greeks", "Phoenicians"],
    answerIndex: 1,
  },
  {
    id: 4,
    category: "Geography",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answerIndex: 3,
  },
  {
    id: 5,
    category: "Math",
    question: "What is the square root of 81?",
    options: ["7", "8", "9", "10"],
    answerIndex: 2,
  },
  {
    id: 6,
    category: "Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Mercury"],
    answerIndex: 0,
  },
];

let activeQuestions = [...questionBank];
let currentIndex = 0;
let score = 0;
let answeredCount = 0;
let wrongQuestions = [];
let wrongByCategory = {};

const categoryFilterEl = document.getElementById("categoryFilter");
const viewModeEl = document.getElementById("viewMode");
const questionMetaEl = document.getElementById("questionMeta");
const questionTextEl = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const statusEl = document.getElementById("status");
const nextBtn = document.getElementById("nextQuestion");
const scoreLineEl = document.getElementById("scoreLine");
const wrongSummaryEl = document.getElementById("wrongSummary");
const wrongByCategoryEl = document.getElementById("wrongByCategory");

function uniqueCategories() {
  return [...new Set(questionBank.map((q) => q.category))];
}

function setupCategoryFilter() {
  categoryFilterEl.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilterEl.appendChild(option);
  });
}

function renderQuestion() {
  statusEl.textContent = "";
  nextBtn.classList.add("hidden");

  if (!activeQuestions.length) {
    questionMetaEl.textContent = "No questions in this filter.";
    questionTextEl.textContent = "Try another filter.";
    optionsEl.innerHTML = "";
    return;
  }

  if (currentIndex >= activeQuestions.length) {
    currentIndex = 0;
  }

  const q = activeQuestions[currentIndex];
  questionMetaEl.textContent = `Question ${currentIndex + 1}/${activeQuestions.length} • Category: ${q.category}`;
  questionTextEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach((optionText, optionIndex) => {
    const btn = document.createElement("button");
    btn.textContent = optionText;
    btn.className = "option";
    btn.onclick = () => evaluateAnswer(optionIndex, q, btn);
    optionsEl.appendChild(btn);
  });
}

function classifyWrongAnswer(question) {
  wrongQuestions.push(question.id);
  if (!wrongByCategory[question.category]) {
    wrongByCategory[question.category] = 0;
  }
  wrongByCategory[question.category] += 1;
}

function evaluateAnswer(selectedIndex, question, clickedButton) {
  const optionButtons = [...document.querySelectorAll("button.option")];
  optionButtons.forEach((btn) => (btn.disabled = true));

  answeredCount += 1;

  if (selectedIndex === question.answerIndex) {
    score += 1;
    clickedButton.classList.add("correct");
    statusEl.textContent = "✅ Correct!";
  } else {
    clickedButton.classList.add("wrong");
    optionButtons[question.answerIndex].classList.add("correct");
    classifyWrongAnswer(question);
    statusEl.textContent = `❌ Wrong. Classified under '${question.category}' for review.`;
  }

  nextBtn.classList.remove("hidden");
  renderProgress();
}

function renderProgress() {
  scoreLineEl.textContent = `Score: ${score}/${answeredCount}`;
  wrongSummaryEl.textContent = `Wrong answers: ${wrongQuestions.length}`;

  const entries = Object.entries(wrongByCategory);
  if (!entries.length) {
    wrongByCategoryEl.innerHTML = "<p>No wrong categories yet.</p>";
    return;
  }

  wrongByCategoryEl.innerHTML = "<strong>Wrong by category:</strong>";
  const list = document.createElement("ul");
  entries.forEach(([category, count]) => {
    const item = document.createElement("li");
    item.textContent = `${category}: ${count}`;
    list.appendChild(item);
  });
  wrongByCategoryEl.appendChild(list);
}

function applyFilter() {
  const mode = viewModeEl.value;
  const selectedCategory = categoryFilterEl.value;

  if (mode === "wrongOnly") {
    const wrongSet = new Set(wrongQuestions);
    activeQuestions = questionBank.filter((q) => wrongSet.has(q.id));
  } else if (mode === "category" && selectedCategory !== "all") {
    activeQuestions = questionBank.filter((q) => q.category === selectedCategory);
  } else {
    activeQuestions = [...questionBank];
  }

  currentIndex = 0;
  renderQuestion();
}

function nextQuestion() {
  if (!activeQuestions.length) return;
  currentIndex = (currentIndex + 1) % activeQuestions.length;
  renderQuestion();
}

function resetProgress() {
  activeQuestions = [...questionBank];
  currentIndex = 0;
  score = 0;
  answeredCount = 0;
  wrongQuestions = [];
  wrongByCategory = {};
  viewModeEl.value = "all";
  categoryFilterEl.value = "all";
  renderProgress();
  renderQuestion();
}

document.getElementById("applyFilter").addEventListener("click", applyFilter);
document.getElementById("resetProgress").addEventListener("click", resetProgress);
nextBtn.addEventListener("click", nextQuestion);

setupCategoryFilter();
renderProgress();
renderQuestion();
