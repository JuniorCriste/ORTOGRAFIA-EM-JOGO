// Base de Dados Oficial das Questões e Níveis
const quizDatabase = [
    { text: "O ____ deve ser combatido na escola e fora dela.", options: ["bullying", "bullyng"], correct: 1, level: "Nível Básico" },
    { text: "O ____ é essencial para uma boa convivência.", options: ["respeito", "respeyto"], correct: 1, level: "Nível Básico" },
    { text: "A ____ entre colegas torna o ambiente mais acolhedor.", options: ["amizade", "amisade"], correct: 1, level: "Nível Básico" },
    { text: "O ____ pode machucar emocionalmente uma pessoa.", options: ["bullying", "bulin"], correct: 1, level: "Nível Básico" },
    { text: "A ____ é importante para aceitar as diferenças.", options: ["diversidade", "divercidade"], correct: 1, level: "Nível Básico" },
    { text: "A ____ não deve ser tolerada no ambiente escolar.", options: ["violência", "violensia"], correct: 1, level: "Nível Intermediário" },
    { text: "A ____ ajuda a compreender os sentimentos do outro.", options: ["empatia", "enpatia"], correct: 1, level: "Nível Intermediário" },
    { text: "A ____ é fundamental para viver em grupo.", options: ["convivência", "convivensia"], correct: 1, level: "Nível Intermediário" },
    { text: "A ____ deve ser denunciada sempre.", options: ["discriminação", "discriminassão"], correct: 1, level: "Nível Intermediário" },
    { text: "O ____ também pode acontecer nas redes sociais.", options: ["cyberbullying", "cyberbuling"], correct: 1, level: "Nível Intermediário" },
    { text: "A ____ promove o respeito às diferenças.", options: ["inclusão", "enclusão"], correct: 1, level: "Nível Intermediário" },
    { text: "A ____ pode causar danos psicológicos.", options: ["humilhação", "umilhação"], correct: 1, level: "Nível Intermediário" },
    { text: "A ____ entre colegas deve ser incentivada na escola.", options: ["solidariedade", "solidareidade"], correct: 1, level: "Nível Avançado" },
    { text: "A ____ é necessária para assumir atitudes corretas.", options: ["responsabilidade", "responsabelidade"], correct: 1, level: "Nível Avançado" },
    { text: "A ____ pode ser prejudicada por situações de bullying.", options: ["autoestima", "auto-estima"], correct: 1, level: "Nível Avançado" },
    { text: "A ____ precisa ser combatida em todas as suas formas.", options: ["opressão", "opreção"], correct: 1, level: "Nível Avançado" },
    { text: "A ____ é essencial para um ambiente escolar saudável.", options: ["conscientização", "conscientizassão"], correct: 1, level: "Nível Avançado" },
    { text: "A ____ ajuda a construir relações mais justas.", options: ["resistência", "rezistência"], correct: 1, level: "Nível Avançado" },
    { text: "A ____ das atitudes é importante para evitar conflitos.", options: ["consequência", "consequensia"], correct: 1, level: "Nível Avançado" },
    { text: "O ____ deve prevalecer em todas as relações humanas.", options: ["respeito", "rezpeito"], correct: 1, level: "Nível Avançado" }
];

let gameQuestions = [];
let currentQuestionIdx = 0;
let webcamStream = null;

// Função para iniciar após o clique no botão inicial
function startGame() {
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    document.getElementById("leaderboard-section").classList.remove("hidden");
    
    // Organiza as questões em ordem aleatória
    gameQuestions = [...quizDatabase].sort(() => Math.random() - 0.5);
    currentQuestionIdx = 0;
    
    closeWebcam();
    loadNextQuestion();
}

// Renderiza a pergunta vigente
function loadNextQuestion() {
    if (currentQuestionIdx >= gameQuestions.length) {
        triggerVictoryFlow();
        return;
    }

    const currentQ = gameQuestions[currentQuestionIdx];
    
    // Atualiza barra de progresso e informações na tela
    document.getElementById("level-badge").innerText = currentQ.level;
    document.getElementById("progress-text").innerText = `Questão ${currentQuestionIdx + 1} / ${gameQuestions.length}`;
    
    const percentage = ((currentQuestionIdx) / gameQuestions.length) * 100;
    document.getElementById("progress-fill").style.width = `${percentage}%`;
    
    document.getElementById("question-text").innerText = currentQ.text;
    document.getElementById("opt1-text").innerText = `1 - ${currentQ.options[0]}`;
    document.getElementById("opt2-text").innerText = `2 - ${currentQ.options[1]}`;
}

// Processa a escolha do aluno
function selectOption(chosenIdx) {
    if (currentQuestionIdx >= gameQuestions.length) return;

    const currentQ = gameQuestions[currentQuestionIdx];

    if (chosenIdx === currentQ.correct) {
        // Resposta correta, avança no jogo
        currentQuestionIdx++;
        loadNextQuestion();
    } else {
        // Errou, toma o "Game Over" e reseta instantaneamente para o início
        alert("Ops! Resposta errada. O desafio reiniciou! Concentre-se e tente o Perfect Run!");
        startGame();
    }
}

// Vincula as teclas 1 e 2 do teclado físico
window.addEventListener("keydown", (e) => {
    const isQuizActive = !document.getElementById("quiz-screen").classList.contains("hidden");
    if (!isQuizActive) return;

    if (e.key === "1") selectOption(1);
    if (e.key === "2") selectOption(2);
});

/* Fluxo de Vitória e Configuração da Câmera */
function triggerVictoryFlow() {
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("victory-screen").classList.remove("hidden");
    document.getElementById("progress-fill").style.width = `100%`;

    // Inicia e prepara a câmera em segundo plano
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .then(stream => {
            const videoElement = document.getElementById("webcam");
            videoElement.srcObject = stream;
            webcamStream = stream;
        })
        .catch(err => {
            console.warn("Câmera indisponível: ", err);
            document.getElementById("pose-instruction").innerHTML = `
                <p style="color: #64748b;">Dispositivo de vídeo não detectado.</p>
                <button class="btn-primary" onclick="saveAutomatedWinner(null)">Entrar no Ranking</button>
            `;
        });
}

// Inicia a Contagem Regressiva de 5 segundos (Tela de Pose)
function startPhotoFlow() {
    document.getElementById("photo-btn").classList.add("hidden");
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
            captureFinalSnapshot(); // Bate a foto imediatamente
        }
    }, 1000);
}

// Renderiza a captura e prepara o salvamento
function captureFinalSnapshot() {
    const video = document.getElementById("webcam");
    const canvas = document.getElementById("capture-canvas");
    const context = canvas.getContext("2d");

    // Mantém a foto espelhada idêntica ao vídeo do jogo
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);

    const snapshotBase64 = canvas.toDataURL("image/png");
    saveAutomatedWinner(snapshotBase64);
}

// Salva e preenche o ranking de forma autônoma
function saveAutomatedWinner(photoData) {
    const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%234ade80'/><text x='50%' y='65%' font-family='sans-serif' font-size='10' fill='white' text-anchor='middle'>⭐</text></svg>`;
    
    const localRecords = JSON.parse(localStorage.getItem("pro_players_db")) || [];
    
    // Define o ID automático incremental baseado no tamanho do ranking histórico
    const currentNumber = localRecords.length + 1;
    const computedName = `Pro Player #${currentNumber}`;

    const newWinner = {
        name: computedName,
        photo: photoData || fallbackAvatar,
        timestamp: new Date().toLocaleDateString('pt-BR')
    };

    // Coloca no topo
    localRecords.unshift(newWinner);

    // Corta e mantém apenas os 10 últimos colocados
    if (localRecords.length > 10) {
        localRecords.pop();
    }

    localStorage.setItem("pro_players_db", JSON.stringify(localRecords));
    displayLeaderboard();

    alert(`Parabéns! Registro salvo como ${computedName}. Vamos recomeçar!`);
    
    // Reinicia o fluxo para a tela inicial
    document.getElementById("victory-screen").classList.add("hidden");
    document.getElementById("photo-btn").classList.remove("hidden");
    document.getElementById("loading-screen").classList.remove("hidden");
}

// Atualiza visualmente o painel dos 10 campeões
function displayLeaderboard() {
    const container = document.getElementById("leaderboard-list");
    const localRecords = JSON.parse(localStorage.getItem("pro_players_db")) || [];

    container.innerHTML = "";

    if (localRecords.length === 0) {
        container.innerHTML = `<p style="grid-column: span 2; color: #64748b;">Nenhum campeão registrado ainda nesta máquina. Seja o pioneiro!</p>`;
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

// Execução ao abrir a página
window.onload = function() {
    displayLeaderboard();
};