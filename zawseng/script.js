const questionsByCategory = {
    BMC: [
      {
        question: "___ is the mass of unit volume of homogeneous meterial.",
        options: ["A. Density index", "B. Bulk density", "C. Specific weight", "D. Density"],
        correctAnswer: "D"
      },
      {
        question: "___ is the mass of a unit volume of material in its natural state.",
        options: ["A. Density", "B. Specific weight", "C. Bulk density", "D. Density index"],
        correctAnswer: "C"
      },
      {
        question: "Density index is the ratio of ___.",
        options: ["A. density to bulk density", "B. density to specific weight", "C. bulk density to density", "D. bulk density to specific weight"],
        correctAnswer: "C"
      },
      {
        question: "Specific weight also known as ___.",
        options: ["A. unit weight", "B. density index", "C. void ratio", "D. specific gravity"],
        correctAnswer: "A"
      },
      {
        question: "___ are also used for relative density.",
        options: ["A. Specific gravity ", "B. Specific weight ", "C. Density index", "D. Void ratio"],
        correctAnswer: "B"
      },
      {
        question: "Void ratio is defined as the ratio of volume of void to the ___ of solids.",
        options: ["A. volume ", "B. weight ", "C. density", "D. porosity"],
        correctAnswer: "A"
      }
    ],
    physics: [
      {
        question: "What is the unit of force?",
        options: ["A. Newton", "B. Joule", "C. Watt", "D. Pascal"],
        correctAnswer: "A"
      },
      {
        question: "What is the speed of light?",
        options: ["A. 300,000 km/s", "B. 150,000 km/s", "C. 500,000 km/s", "D. 1,000,000 km/s"],
        correctAnswer: "A"
      }
    ],
    english: [
      {
        question: "What is the past tense of 'go'?",
        options: ["A. Went", "B. Gone", "C. Going", "D. Goes"],
        correctAnswer: "A"
      },
      {
        question: "What is a synonym for 'happy'?",
        options: ["A. Sad", "B. Joyful", "C. Angry", "D. Tired"],
        correctAnswer: "B"
      }
    ]
  };
  
  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  const userAnswers = []; // Store user's answers
  const correctAnswers = []; // Store correct answers
  
  const categoryContainer = document.getElementById("category-container");
  const quizContainer = document.getElementById("quiz-container");
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const resultElement = document.getElementById("result");
  const nextButton = document.getElementById("next-btn");
  const restartButton = document.getElementById("restart-btn");
  
  // Hide the "Next" button initially
  nextButton.style.display = "none";
  restartButton.style.display = "none";
  
  // Handle category selection
  document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      questions = questionsByCategory[category]; // Load questions for the selected category
      categoryContainer.classList.add("hidden"); // Hide category selection
      quizContainer.classList.remove("hidden"); // Show quiz container
      displayQuestion();
    });
  });
  
  function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
    optionsElement.innerHTML = "";
  
    currentQuestion.options.forEach(option => {
      const optionElement = document.createElement("div");
      optionElement.className = "option";
      optionElement.textContent = option;
      optionElement.addEventListener("click", () => checkAnswer(option[0]));
      optionsElement.appendChild(optionElement);
    });
  }
  
  function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    userAnswers.push(selectedAnswer); // Store user's answer
    correctAnswers.push(correctAnswer); // Store correct answer
  
    const options = document.querySelectorAll(".option");
    options.forEach(option => {
      option.style.pointerEvents = "none"; // Disable further clicks on options
      if (option.textContent.startsWith(correctAnswer)) {
        option.classList.add("correct"); // Add class for correct answer
      } else if (option.textContent.startsWith(selectedAnswer)) {
        option.classList.add("incorrect"); // Add class for incorrect answer
      }
    });
    if (selectedAnswer === correctAnswer) {
        score++;
    }
    nextButton.style.display = "block"; // Show the "Next" button
  }
  
  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
      resultElement.textContent = "";
      nextButton.style.display = "none"; // Hide the "Next" button for the next question
    } else {
      endQuiz();
    }
  }
  
  function endQuiz() {
    questionElement.textContent = ``;
    optionsElement.innerHTML = "";
  
    // Display results for each question
    let resultsHTML = `<h3>Your Results: ${score} of ${questions.length}</h3>`;
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = correctAnswers[index];
  
      // Find the full option text for the user's answer and correct answer
      const userAnswerText = question.options.find(opt => opt.startsWith(userAnswer)) || "Not answered";
      const correctAnswerText = question.options.find(opt => opt.startsWith(correctAnswer));
  
      resultsHTML += `
        <div class="result-item">
          <p><strong>${index + 1}.</strong> ${question.question}</p>
          <p> Your Answer : ${userAnswerText}</p>
          <p> Correct Answer : ${correctAnswerText}</p>
        </div>
        <hr>
      `;
    });
  
    resultElement.innerHTML = resultsHTML;
    nextButton.style.display = "none";
    restartButton.style.display = "block"; // Show the restart button
  }
  
  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers.length = 0; // Clear user's answers
    correctAnswers.length = 0; // Clear correct answers
    resultElement.innerHTML = ""; // Clear the result display
    categoryContainer.classList.remove("hidden"); // Show category selection
    quizContainer.classList.add("hidden"); // Hide quiz container
    nextButton.style.display = "none";
    restartButton.style.display = "none";
  }
  
  nextButton.addEventListener("click", nextQuestion);
  restartButton.addEventListener("click", restartQuiz);
