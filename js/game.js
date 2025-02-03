// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé");
    
    const canvas = document.getElementById("gameCanvas");
    console.log("Canvas trouvé:", canvas);
    
    const ctx = canvas.getContext("2d");
    console.log("Contexte 2D obtenu:", ctx);

    // Constantes du jeu
    const SPRINT_DURATION = 60; // durée en secondes (1 minute)
    const STORY_POINTS = [1, 2, 3, 5, 8];
    const columns = [50, 200, 350, 500];
    const columnTitles = ["To Do", "In Progress", "Review", "Done"];
    
    // Nouvelle constante pour les tickets terminés
    let completedTickets = []; // Stocke les tickets en Done

    // Variables du jeu
    let player = {
        x: columns[0],
        y: 120,
        width: 40,
        height: 40,
        columnIndex: 0,
        velocityY: 0,
        speedY: 5,
        points: STORY_POINTS[Math.floor(Math.random() * STORY_POINTS.length)] // Points du ticket actuel
    };
    let obstacles = [];
    let boosts = [];
    let gameOver = false;
    let score = 0;
    let timeLeft = SPRINT_DURATION;
    let sprintStarted = false;
    let gameIsPaused = false;
    let gameState = "welcome"; // "welcome", "playing", "paused", "gameover"

    // Constantes pour l'affichage
    const BOARD_TOP_MARGIN = 50; // Espace pour le timer au-dessus du tableau
    const TIMER_Y = 25; // Position Y du timer (plus haut)
    const BOARD_HEIGHT = 300;
    const BOARD_WIDTH = 600;

    // Constantes pour l'affichage des tickets
    const TICKET_MARGIN = 10; // Espace entre les tickets
    const TICKET_START_Y = 10; // Position Y du premier ticket dans Done

    // Variables pour les intervalles
    let obstacleInterval;
    let boostInterval;

    // Système de gestion audio
    const SOUNDS = {
        done: document.getElementById('sound-done'),
        obstacle: document.getElementById('sound-obstacle'),
        boost: document.getElementById('sound-boost'),
        start: document.getElementById('sound-start'),
        end: document.getElementById('sound-end')
    };

    // Fonction utilitaire pour jouer un son avec gestion du volume
    function playSound(soundName) {
        if (SOUNDS[soundName]) {
            SOUNDS[soundName].volume = 0.5; // Volume à 50%
            SOUNDS[soundName].currentTime = 0;
            SOUNDS[soundName].play().catch(error => {
                console.log("Erreur de lecture audio:", error);
            });
        }
    }

    // Fonction pour créer un nouveau ticket
    function createNewTicket() {
        player.x = columns[0];
        player.columnIndex = 0;
        player.points = STORY_POINTS[Math.floor(Math.random() * STORY_POINTS.length)];
    }

    function spawnObstacle() {
        const obstacleName = "Impediment";
        obstacles.push({ 
            x: canvas.width, // Partir du bord droit du canvas
            y: Math.random() * (BOARD_HEIGHT - 30), // Position verticale dans la zone de jeu
            width: 30, 
            height: 30, 
            label: obstacleName 
        });
    }

    function spawnBoost() {
        boosts.push({
            x: canvas.width, // Partir du bord droit du canvas
            y: Math.random() * (BOARD_HEIGHT - 40), // Position verticale dans la zone de jeu
            width: 40,
            height: 40,
            label: "Collaboration"
        });
    }

    function updateTimer() {
        if (!sprintStarted || gameOver || gameIsPaused) return;
        
        timeLeft -= 1/60;
        if (timeLeft <= 0) {
            gameOver = true;
            playSound('end'); // Son de fin
            alert(`Sprint terminé !\nVélocité : ${score} points`);
        }
    }

    function update() {
        if (gameOver || gameIsPaused || !sprintStarted) return;
        
        updateTimer();

        player.y += player.velocityY;
        player.y = Math.max(0, Math.min(BOARD_HEIGHT - player.height, player.y));

        // Gestion des obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= 5;
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                continue;
            }
            if (player.columnIndex < 3 && 
                player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y
            ) {
                if (player.columnIndex === 0) {
                    gameOver = true;
                    playSound('end');
                    alert("Game Over ! Un impediment vous a bloqué dès le début...");
                } else {
                    player.columnIndex--;
                    player.x = columns[player.columnIndex];
                    playSound('obstacle');
                }
            }
        }

        // Gestion des boosts
        for (let i = boosts.length - 1; i >= 0; i--) {
            boosts[i].x -= 5;
            if (boosts[i].x + boosts[i].width < 0) {
                boosts.splice(i, 1);
                continue;
            }
            if (player.columnIndex < 3 &&
                player.x < boosts[i].x + boosts[i].width &&
                player.x + player.width > boosts[i].x &&
                player.y < boosts[i].y + boosts[i].height &&
                player.y + player.height > boosts[i].y
            ) {
                if (player.columnIndex < columns.length - 1) {
                    player.columnIndex++;
                    player.x = columns[player.columnIndex];
                    if (player.columnIndex === columns.length - 1) {
                        // Calculer la position Y du nouveau ticket
                        const newTicketY = completedTickets.length * (player.height + TICKET_MARGIN) + TICKET_START_Y;
                        
                        // Ajouter le ticket à la liste des tickets terminés
                        completedTickets.push({
                            y: newTicketY,
                            points: player.points
                        });
                        score += player.points;
                        createNewTicket();
                        playSound('done');
                    } else {
                        playSound('boost');
                    }
                }
                boosts.splice(i, 1);
            }
        }
    }

    // Fonction pour dessiner l'écran d'accueil
    function drawWelcomeScreen() {
        // Fond blanc
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fond gris clair pour la zone de jeu
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, BOARD_TOP_MARGIN, canvas.width, BOARD_HEIGHT);

        // Titre
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        let y = BOARD_TOP_MARGIN + 40;
        ctx.fillText("Agile Post-it Journey", canvas.width/2, y);

        // Objectif principal
        y += 40;
        ctx.font = "20px Arial";
        ctx.fillText("Faites passer un maximum de tickets en Done pendant le sprint !", canvas.width/2, y);

        // Règles du jeu
        y += 40;
        ctx.fillText("• Les tickets jaunes ont des points de complexité (1-8)", canvas.width/2, y);
        y += 30;
        ctx.fillText("• Les boosts verts vous font avancer", canvas.width/2, y);
        y += 30;
        ctx.fillText("• Les obstacles rouges vous font reculer", canvas.width/2, y);
        y += 30;
        ctx.fillText("• Game over si bloqué en To Do", canvas.width/2, y);
        y += 30;
        ctx.fillText("Durée du sprint : 60 secondes", canvas.width/2, y);

        // Contrôles
        y += 30;
        ctx.fillText("Contrôles :", canvas.width/2, y);
        y += 25;
        ctx.fillText("↑↓ : Déplacer le ticket", canvas.width/2, y);
        y += 25;
        ctx.fillText("ESPACE : Démarrer/Pause", canvas.width/2, y);

        // Exemples visuels
        const centerX = canvas.width/2;
        const exampleY = y + 50; // Position des exemples sous les contrôles
        const spacing = 150;

        // Ticket
        ctx.fillStyle = "yellow";
        ctx.fillRect(centerX - spacing - 20, exampleY, 40, 40);
        ctx.fillStyle = "black";
        ctx.fillText("5", centerX - spacing, exampleY + 25);
        ctx.fillText("Ticket (5 pts)", centerX - spacing, exampleY + 60);

        // Boost
        ctx.fillStyle = "green";
        ctx.fillRect(centerX - 20, exampleY, 40, 40);
        ctx.fillStyle = "black";
        ctx.fillText("Boost", centerX, exampleY + 60);

        // Obstacle
        ctx.fillStyle = "red";
        ctx.fillRect(centerX + spacing - 20, exampleY, 40, 40);
        ctx.fillStyle = "black";
        ctx.fillText("Impediment", centerX + spacing, exampleY + 60);

        // Instructions de démarrage (déplacé après les exemples)
        ctx.font = "20px Arial";
        ctx.fillText("Appuyez sur ESPACE pour commencer", canvas.width/2, exampleY + 100);
    }

    function draw() {
        if (gameState === "welcome") {
            drawWelcomeScreen();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fond blanc pour tout le canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Timer en haut, plus haut au-dessus du tableau
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Sprint: ${Math.ceil(timeLeft)}s`, canvas.width/2, TIMER_Y);

        // Fond gris clair pour le tableau Kanban
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, BOARD_TOP_MARGIN, canvas.width, BOARD_HEIGHT);

        // Dessiner les colonnes et leurs titres
        ctx.fillStyle = "gray";
        for (let i = 0; i < columns.length; i++) {
            // Dessiner les séparateurs de colonnes
            ctx.fillRect(columns[i] - 10, BOARD_TOP_MARGIN, 10, BOARD_HEIGHT);
            
            // Calculer le centre de la colonne pour le titre
            let nextColumn = (i < columns.length - 1) ? columns[i + 1] : canvas.width;
            let columnCenter = (columns[i] + nextColumn) / 2;
            
            // Dessiner le titre centré
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(columnTitles[i], columnCenter - 5, BOARD_TOP_MARGIN - 10);
            ctx.fillStyle = "gray";
        }

        // Dessiner les tickets terminés dans la colonne Done
        ctx.fillStyle = "yellow";
        for (let ticket of completedTickets) {
            ctx.fillRect(
                columns[3], 
                BOARD_TOP_MARGIN + ticket.y, 
                player.width, 
                player.height
            );
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                ticket.points, 
                columns[3] + player.width/2, 
                BOARD_TOP_MARGIN + ticket.y + player.height/2
            );
            ctx.fillStyle = "yellow";
        }

        // Dessiner le joueur actif
        if (player.columnIndex < 3) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(player.x, BOARD_TOP_MARGIN + player.y, player.width, player.height);
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(player.points, player.x + player.width/2, BOARD_TOP_MARGIN + player.y + player.height/2);
        }

        // Dessiner les obstacles et boosts avec la marge
        ctx.fillStyle = "red";
        for (let obs of obstacles) {
            ctx.fillRect(obs.x, BOARD_TOP_MARGIN + obs.y, obs.width, obs.height);
        }

        ctx.fillStyle = "green";
        for (let boost of boosts) {
            ctx.fillRect(boost.x, BOARD_TOP_MARGIN + boost.y, boost.width, boost.height);
        }

        // Score en bas du tableau
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Vélocité: ${score} points`, canvas.width/2, BOARD_TOP_MARGIN + BOARD_HEIGHT + 30);

        // Afficher l'écran de pause si le jeu est en pause
        if (gameIsPaused) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("PAUSE", canvas.width/2, canvas.height/2 - 20);
            ctx.font = "20px Arial";
            ctx.fillText("Appuyez sur ESPACE pour reprendre", canvas.width/2, canvas.height/2 + 20);
        }

        // Garder l'écran de démarrage en dernier
        if (!sprintStarted) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Prêt ? Appuyez sur ESPACE !", canvas.width/2, canvas.height/2);
        }
    }

    function gameLoop() {
        console.log("GameLoop appelé");
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Modifier la gestion des événements
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            if (gameState === "welcome") {
                gameState = "playing";
                sprintStarted = false;
                timeLeft = SPRINT_DURATION;
                score = 0;
            } else if (!sprintStarted && gameState === "playing") {
                sprintStarted = true;
                playSound('start'); // Son de démarrage
                obstacleInterval = setInterval(spawnObstacle, 2000);
                boostInterval = setInterval(spawnBoost, 5000);
            } else if (!gameOver) {
                gameIsPaused = !gameIsPaused;
            }
        }

        // Ne permettre le mouvement que si le sprint est démarré
        if (gameState === "playing" && sprintStarted && !gameIsPaused) {
            if (event.code === "ArrowUp") {
                player.velocityY = -player.speedY;
            }
            if (event.code === "ArrowDown") {
                player.velocityY = player.speedY;
            }
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.code === "ArrowUp" || event.code === "ArrowDown") {
            player.velocityY = 0;
        }
    });

    // Démarrage du jeu
    console.log("Démarrage du jeu");
    gameLoop();
}); 