document.addEventListener('DOMContentLoaded', function () {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result');
    const nextQuestionButton = document.getElementById('next-question');
    const prevQuestionButton = document.getElementById('prev-question');

    let questions = [];
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];

    // Função para carregar o arquivo de questões
    fetch('questions.txt')
        .then(response => response.text())
        .then(data => {
            questions = parseQuestions(data);
            selectedQuestions = selectRandomQuestions(questions, 10); // Selecionar 10 questões aleatórias
            showQuestion();
        });

    // Função para analisar as questões do arquivo TXT
    function parseQuestions(data) {
        const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        let questions = [];
        for (let i = 0; i < lines.length; i += 6) {
            const question = {
                text: lines[i].split(':')[1],
                options: {
                    a: lines[i + 1].split(':')[1],
                    b: lines[i + 2].split(':')[1],
                    c: lines[i + 3].split(':')[1],
                    d: lines[i + 4].split(':')[1]
                },
                correct: lines[i + 5].split(':')[1]
            };
            questions.push(question);
        }
        return questions;
    }

    // Função para selecionar aleatoriamente N questões de um array
    function selectRandomQuestions(array, num) {
        let shuffled = [...array];
        shuffleArray(shuffled);
        return shuffled.slice(0, num);
    }

    // Função para embaralhar um array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Função para mostrar uma questão
    function showQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            showResults();
            return;
        }

        const question = selectedQuestions[currentQuestionIndex];
        quizContainer.innerHTML = `
            <h2>${question.text}</h2>
            <form id="quiz-form">
                <label><input type="radio" name="option" value="a"> ${question.options.a}</label>
                <label><input type="radio" name="option" value="b"> ${question.options.b}</label>
                <label><input type="radio" name="option" value="c"> ${question.options.c}</label>
                <label><input type="radio" name="option" value="d"> ${question.options.d}</label>
            </form>
        `;

        // Se já houver uma resposta para esta questão, marcá-la como selecionada
        if (userAnswers[currentQuestionIndex] !== undefined) {
            const selectedAnswer = userAnswers[currentQuestionIndex].selectedAnswer;
            document.querySelector(`input[name="option"][value="${selectedAnswer}"]`).checked = true;
        }
    }

    // Função para verificar a resposta e passar para a próxima questão
    nextQuestionButton.addEventListener('click', function () {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (!selectedOption) {
            alert('Por favor, selecione uma opção.');
            return;
        }

        const answer = selectedOption.value;

        // Armazenar a resposta do usuário
        userAnswers[currentQuestionIndex] = {
            question: selectedQuestions[currentQuestionIndex].text,
            correctAnswer: selectedQuestions[currentQuestionIndex].correct,
            selectedAnswer: answer,
            options: selectedQuestions[currentQuestionIndex].options
        };

        if (answer === selectedQuestions[currentQuestionIndex].correct) {
            score++;
        }

        currentQuestionIndex++;
        showQuestion();
    });

    // Função para voltar para a questão anterior
    prevQuestionButton.addEventListener('click', function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    // Função para mostrar os resultados
function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '<h2>Resultados do Quiz</h2>';
    userAnswers.forEach((answer, index) => {
        const isCorrect = answer.correctAnswer === answer.selectedAnswer;
        quizContainer.innerHTML += `
            <div>
                <h3>Questão ${index + 1}: ${answer.question}</h3>
                <p class="${isCorrect ? 'correct' : 'incorrect'}">
                    Sua resposta: ${answer.options[answer.selectedAnswer]} ${isCorrect ? '✅' : '❌'}
                </p>
                ${!isCorrect ? `<p class="correct">Resposta correta: ${answer.options[answer.correctAnswer]}</p>` : ''}
            </div>
        `;
    });
    quizContainer.innerHTML += `<p>Seu score: ${score}/${selectedQuestions.length}</p>`;
    nextQuestionButton.style.display = 'none';
    prevQuestionButton.style.display = 'none';
}
});
