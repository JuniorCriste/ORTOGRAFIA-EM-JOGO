// Banco de dados imutável do Quiz escolar
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
let currentRenderedOptions = [];
let executionState = "INTRO"; // INTRO, PLAYING, GAMEOVER, VICTORY

// Paletas cromáticas para alternar dinamicamente o fundo
const bgPalettes = [
    "linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(157, 78, 221, 0.2))",
    "linear-gradient(135deg, rgba(255, 0, 127, 0.2), rgba(255, 107, 53, 0.2))",
    "linear-gradient(135deg, rgba(0, 255, 135, 0.2), rgba(0, 210, 255, 0.2))",
    "linear-gradient(135deg, rgba(157, 78, 221, 0.2), rgba(255, 51, 51, 0.2))"
];

// Altera a cor e velocidade dos elementos ao fundo do jogo
function mutateBackgroundBackground() {
    const cubes = document.querySelectorAll(".cube");
    const chosenPalette = bgPalettes[Math.floor(Math.random() * bgPalettes.length)];
    
    cubes.forEach(cube => {
        cube.style.background = chosenPalette;
        // Altera levemente a velocidade para gerar dinamismo físico
        cube.style.animationDuration = `${Math.floor(Math.random() * 8) + 8}s`;
    });
}

// Inicializa a engine do quiz
function startGame() {
    executionState = "PLAYING";
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("gameover-screen").classList.add("hidden");
    document.getElementById("victory-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    document.getElementById("leaderboard-section").classList.remove("hidden");
    
    gameQuestions = [...quizDatabase].sort(() => Math.random() - 0.5);
    currentQuestionIdx = 0;
    
    closeWebcam();
    loadNextQuestion();
}

// Renderiza a pergunta vigente com transição CSS aplicada ao elemento-mãe
function loadNextQuestion() {
    mutateBackgroundBackground();
    
    if (currentQuestionIdx >= gameQuestions.length) {
        triggerVictoryFlow();
        return;
    }

    const quizCard = document.getElementById("quiz-card");
    // Reseta classe de animação para forçar re-gatilho de transição
    quizCard.classList.remove("screen-change");
    void quizCard.offsetWidth; 
    quizCard.classList.add("screen-change");

    const currentQ = gameQuestions[currentQuestionIdx];
    
    document.getElementById("level-badge").innerText = currentQ.level;
    document.getElementById("progress-text").innerText = `Questão ${currentQuestionIdx + 1} / ${gameQuestions.length}`;
    
    const percentage = (currentQuestionIdx / gameQuestions.length) * 100;
    document.getElementById("progress-fill").style.width = `${percentage}%`;
    document.getElementById("question-text").innerText = currentQ.text;
    
    currentRenderedOptions = [...currentQ.options].sort(() => Math.random() - 0.5);
    document.getElementById("opt1-text").innerText = currentRenderedOptions[0];
    document.getElementById("opt2-text").innerText = currentRenderedOptions[1];
}

// Processa escolhas analíticas feitas pelo teclado
function evaluateInput(keyNumber) {
    if (executionState === "INTRO" && keyNumber === 1) {
        startGame();
        return;
    }

    if (executionState === "PLAYING" && (keyNumber === 1 || keyNumber === 2)) {
        if (currentQuestionIdx >= gameQuestions.length) return;

        const currentQ = gameQuestions[currentQuestionIdx];
        const selectedAnswerText = currentRenderedOptions[keyNumber - 1];

        if (selectedAnswerText === currentQ.correct) {
            currentQuestionIdx++;
            loadNextQuestion();
        } else {
            triggerDefeatFlow();
        }
    }
}

// EventListener global
window.addEventListener("keydown", (e) => {
    if (e.key === "1") evaluateInput(1);
    if (e.key === "2") evaluateInput(2);
});

/* Fluxo de Derrota - Sem interrupções por pop-ups nativos */
function triggerDefeatFlow() {
    executionState = "GAMEOVER";
    mutateBackgroundBackground();
    
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("leaderboard-section").classList.add("hidden");
    document.getElementById("gameover-screen").classList.remove("hidden");
    
    // Constrói o espelho do ranking em tamanho estendido dentro da div correspondente
    displayLeaderboard("leaderboard-list-defeat");

    const cooldownFill = document.getElementById("defeat-cooldown");
    cooldownFill.style.transition = "none";
    cooldownFill.style.width = "100%";
    
    // Inicia encolhimento progressivo da barra durante os 5s
    setTimeout(() => {
        cooldownFill.style.transition = "width 5s linear";
        cooldownFill.style.width = "0%";
    }, 50);

    // Retorna automaticamente após o término do timer
    setTimeout(() => {
        if (executionState === "GAMEOVER") {
            returnToMenu();
        }
    }, 5050);
}

/* Fluxo de Vitória Automático */
function triggerVictoryFlow() {
    executionState = "VICTORY";
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("victory-screen").classList.remove("hidden");

    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .then(stream => {
            document.getElementById("webcam").srcObject = stream;
            webcamStream = stream;
            startAutomaticCountdown();
        })
        .catch(() => {
            // Se o hardware de vídeo falhar, avança direto de forma segura sem quebrar
            setTimeout(() => { saveAutomatedWinner(null); }, 4000);
        });
}

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
            captureFinalSnapshot();
        }
    }, 1000);
}

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

function saveAutomatedWinner(photoData) {
    const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2300ff87'/><text x='50%' y='65%' font-family='sans-serif' font-size='10' fill='black' text-anchor='middle'>⭐</text></svg>`;
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
    
    // Atualiza estruturas de visualização globais
    displayLeaderboard("leaderboard-list-main");

    // Aguarda exibição da vitória por 3s antes de retornar à estaca zero
    setTimeout(() => {
        returnToMenu();
    }, 3000);
}

function returnToMenu() {
    executionState = "INTRO";
    closeWebcam();
    document.getElementById("gameover-screen").classList.add("hidden");
    document.getElementById("victory-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("loading-screen").classList.remove("hidden");
    document.getElementById("leaderboard-section").classList.remove("hidden");
    displayLeaderboard("leaderboard-list-main");
}

// Popula o container especificado via parâmetro estrutural (Normal ou Tela cheia)
function displayLeaderboard(targetContainerId) {
    const container = document.getElementById(targetContainerId);
    if (!container) return;
    
    const localRecords = JSON.parse(localStorage.getItem("pro_players_db")) || [];
    container.innerHTML = "";

    if (localRecords.length === 0) {
        container.innerHTML = `<p style="grid-column: span 2; color: #64748b; text-align: center; width: 100%;">Nenhum campeão registrado ainda nesta máquina.</p>`;
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
    displayLeaderboard("leaderboard-list-main");
};