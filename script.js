// Base de Dados Oficial das Questões e Níveis
const quizDatabase = [
    { text: "O ____ deve ser combatido na escola e fora dela.", options: ["bullying", "bullyng"], correct: "bullying", level: "Nível Básico" },
    { text: "O ____ é essencial para uma boa convivência.", options: ["respeito", "respeyto"], correct: "respeito", level: "Nível Básico" },
    { text: "A ____ entre colegas torna o ambiente mais acolhedor.", options: ["amizade", "amisade"], correct: "amizade", level: "Nível Básico" },
    { text: "O ____ pode machucar emocionalmente uma pessoa.", options: ["bullying", "bulin"], correct: "bullying", level: "Nível Básico" },
    { text: "A ____ é importante para aceitar as diferenças.", options: ["diversidade", "divercidade"], correct: "diversidade", level: "Nível Básico" },
    { text: "A ____ não deve ser tolerada no ambiente escolar.", options: ["violência", "violensia"], correct: "violência", level: "Nível Intermediário" },
    { text: "A ____ ajuda a compreender os sentimentos do outro.", options: ["empatia", "enpatia"], correct: "empatia", level: "Nível Intermediário" },
    { text: "A ____ é fundamental para viver em grupo.", options: ["convivência", "convivensia"], correct: "convivência", level: "Nível Intermediário" },
    { text: "A ____ deve ser denunciada sempre.", options: ["discriminação", "discriminassão"], correct: "discriminação", level: "Nível Intermediário" },
    { text: "O ____ também pode acontecer nas redes sociais.", options: ["cyberbullying", "cyberbuling"], correct: "cyberbullying", level: "Nível Intermediário" },
    { text: "A ____ promove o respeito às diferenças.", options: ["inclusão", "enclusão"], correct: "inclusão", level: "Nível Intermediário" },
    { text: "A ____ pode causar danos psicológicos.", options: ["humilhação", "umilhação"], correct: "humilhação", level: "Nível Intermediário" },
    { text: "A ____ entre colegas deve ser incentivada na escola.", options: ["solidariedade", "solidareidade"], correct: "solidariedade", level: "Nível Avançado" },
    { text: "A ____ é necessária para assumir atitudes corretas.", options: ["responsabilidade", "responsabelidade"], correct: "responsabilidade", level: "Nível Avançado" },
    { text: "A ____ pode ser prejudicada por situações de bullying.", options: ["autoestima", "auto-estima"], correct: "autoestima", level: "Nível Avançado" },
    { text: "A ____ precisa ser combatida em todas as suas formas.", options: ["opressão", "opreção"], correct: "opressão", level: "Nível Avançado" },
    { text: "A ____ é essencial para um ambiente escolar saudável.", options: ["conscientização", "conscientizassão"], correct: "conscientização", level: "Nível Avançado" },
    { text: "A ____ ajuda a construir relações mais justas.", options: ["resistência", "rezistência"], correct: "resistência", level: "Nível Avançado" },
    { text: "A ____ das atitudes é importante para evitar conflitos.", options: ["consequência", "consequensia"], correct: "consequência", level: "Nível Avançado" },
    { text: "O ____ deve prevalecer em todas as relações humanas.", options: ["respeito", "rezpeito"], correct: "respeito", level: "Nível Avançado" }
];

let gameQuestions = [];
let currentQuestionIdx = 0;
let webcamStream = null;
let currentRenderedOptions = []; // Armazena a ordem embaralhada da pergunta atual

// Inicializa o jogo e embaralha as perguntas
function startGame() {
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    document.getElementById("leaderboard-section").classList.remove("hidden");
    
    gameQuestions = [...quizDatabase].sort(() => Math.random() - 0.5);
    currentQuestionIdx = 0;
    
    closeWebcam();
    loadNextQuestion();
}

// Prepara e exibe a pergunta
function loadNextQuestion() {
    if (currentQuestionIdx >= gameQuestions.length) {
        triggerVictoryFlow();
        return;
    }

    const currentQ = gameQuestions[currentQuestionIdx];
    
    document.getElementById("level-badge").innerText = currentQ.level;
    document.getElementById("progress-text").innerText = `Questão ${currentQuestionIdx + 1} / ${gameQuestions.length}`;
    
    const percentage = (currentQuestionIdx / gameQuestions.length) * 100;
    document.getElementById("progress-fill").style.width = `${percentage}%`;
    
    document.getElementById("question-text").innerText = currentQ.text;
    
    // EMBARALHA AS RESPOSTAS DA QUESTÃO (Evita que a certa fique sempre no mesmo botão)
    currentRenderedOptions = [...currentQ.options].sort(() => Math.random() - 0.5);
    
    // Renderiza nos cartões SEM colocar números fixos na string (apenas o indicador visual nativo)
    document.getElementById("opt1-text").innerText = currentRenderedOptions[0];
    document.getElementById("opt2-text").innerText = currentRenderedOptions[1];
}

// Avalia a entrada do teclado
function handleInput(keyNumber) {
    const isIntroActive = !document.getElementById("loading-screen").classList.contains("hidden");
    const isQuizActive = !document.getElementById("quiz-screen").classList.contains("hidden");

    // Tela Inicial: Se apertar 1, inicia o jogo
    if (isIntroActive && keyNumber === 1) {
        startGame();
        return;
    }

    // Tela do Jogo: Processa alternativas 1 e 2
    if (isQuizActive && (keyNumber === 1 || keyNumber === 2)) {
        if (currentQuestionIdx >= gameQuestions.length) return;

        const currentQ = gameQuestions[currentQuestionIdx];
        const selectedAnswerText = currentRenderedOptions[keyNumber - 1]; // Pega a string selecionada

        if (selectedAnswerText === currentQ.correct) {
            currentQuestionIdx++;
            loadNextQuestion();
        } else {
            alert("Resposta incorreta! O desafio foi reiniciado.");
            startGame();
        }
    }
}

// Capturador global de teclado físico / teclado numérico
window.addEventListener("keydown", (e) => {
    if (e.key === "1") handleInput(1);
    if (e.key === "2") handleInput(2);
});

/* Fluxo de Vitória Automático */
function triggerVictoryFlow() {
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("victory-screen").classList.remove("hidden");
    document.getElementById("progress-fill").style.width = `100%`;

    // Liga a câmera
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .then(stream => {
            document.getElementById("webcam").srcObject = stream;
            webcamStream = stream;
            startAutomaticCountdown(); // Começa a contar sozinho assim que a câmera ativa
        })
        .catch(err => {
            console.warn("Câmera ausente: ", err);
            // Salva sem foto de forma direta após 3 segundos
            setTimeout(() => { saveAutomatedWinner(null); }, 3000);
        });
}

// Contagem regressiva automatizada de 5s
function startAutomaticCountdown() {
    const overlay = document.getElementById("countdown-overlay");
    overlay.classList.remove("hidden");

    let counter = 5;
    overlay.innerText = counter;

    const interval = setInterval(() => {
        counter--;
        if (counter > 0) {
            overlay.innerText = counter;
        } else {
            clearInterval(interval);
            overlay.classList.add("hidden");
            captureFinalSnapshot(); // Tira a foto instantaneamente ao chegar no 0
        }
    }, 1000);
}

// Captura do Canvas
function captureFinalSnapshot() {
    const video = document.getElementById("webcam");
    const canvas = document.getElementById("capture-canvas");
    const context = canvas.getContext("2d");

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);

    const snapshotBase64 = canvas.toDataURL("image/png");
    saveAutomatedWinner(snapshotBase64);
}

// Insere no ranking usando ID automatizado incremental
function saveAutomatedWinner(photoData) {
    const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%234ade80'/><text x='50%' y='65%' font-family='sans-serif' font-size='10' fill='white' text-anchor='middle'>⭐</text></svg>`;
    const localRecords = JSON.parse(localStorage.getItem("pro_players_db")) || [];
    
    const currentNumber = localRecords.length + 1;
    const computedName = `Pro Player #${currentNumber}`;

    const newWinner = {
        name: computedName,
        photo: photoData || fallbackAvatar,
        timestamp: new Date().toLocaleDateString('pt-BR')
    };

    localRecords.unshift(newWinner);

    if (localRecords.length > 10) {
        localRecords.pop();
    }

    localStorage.setItem("pro_players_db", JSON.stringify(localRecords));
    displayLeaderboard();

    // Aguarda 3 segundos exibindo a foto no ranking e retorna para o início automaticamente
    setTimeout(() => {
        document.getElementById("victory-screen").classList.add("hidden");
        document.getElementById("loading-screen").classList.remove("hidden");
        closeWebcam();
    }, 3000);
}

// Alimenta o ranking
function displayLeaderboard() {
    const container = document.getElementById("leaderboard-list");
    const localRecords = JSON.parse(localStorage.getItem("pro_players_db")) || [];

    container.innerHTML = "";

    if (localRecords.length === 0) {
        container.innerHTML = `<p style="grid-column: span 2; color: #64748b;">Nenhum campeão registrado ainda nesta máquina.</p>`;
        return;
    }

    localRecords.forEach(item => {
        const slot = document.createElement("div");
        slot.className = "player-slot";
        slot.innerHTML = `
            <img src="${item.photo}" alt="Avatar">
            <div class="player-meta">
                <h4>${item.name}</h4>
                <span>Concluiu em ${item.timestamp}</span>
            </div>
        `;
        container.appendChild(slot);
    });
}

function closeWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
}

window.onload = function() {
    displayLeaderboard();
};