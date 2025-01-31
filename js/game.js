// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé");
    
    const canvas = document.getElementById("gameCanvas");
    console.log("Canvas trouvé:", canvas);
    
    const ctx = canvas.getContext("2d");
    console.log("Contexte 2D obtenu:", ctx);

    // Constantes et variables du jeu
    const columns = [50, 200, 350, 500];
    const columnTitles = ["To Do", "In Progress", "Review", "Done"];
    let player = { x: columns[0], y: 120, width: 40, height: 40, columnIndex: 0, velocityY: 0, speedY: 5 };
    console.log("Player initialisé:", player);
    let obstacles = [];
    let boosts = [];
    let gameOver = false;

    function spawnObstacle() {
        const obstacleName = "Impediment";
        obstacles.push({ x: 600, y: Math.random() * 260, width: 30, height: 30, label: obstacleName });
    }

    function spawnBoost() {
        const boostName = "Collaboration";
        boosts.push({ x: 600, y: Math.random() * 260, width: 30, height: 30, label: boostName });
    }

    function update() {
        if (gameOver) return;

        player.y += player.velocityY;
        player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= 5;
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                continue;
            }
            if (
                player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y
            ) {
                if (player.columnIndex === 0) {
                    gameOver = true;
                    alert("Game Over ! Un impediment vous a bloqué dès le début...");
                } else {
                    player.columnIndex--;
                    player.x = columns[player.columnIndex];
                }
            }
        }

        for (let i = boosts.length - 1; i >= 0; i--) {
            boosts[i].x -= 5;
            if (boosts[i].x + boosts[i].width < 0) {
                boosts.splice(i, 1);
                continue;
            }
            if (
                player.x < boosts[i].x + boosts[i].width &&
                player.x + player.width > boosts[i].x &&
                player.y < boosts[i].y + boosts[i].height &&
                player.y + player.height > boosts[i].y
            ) {
                if (player.columnIndex < columns.length - 1) {
                    player.columnIndex++;
                    player.x = columns[player.columnIndex];
                }
                boosts.splice(i, 1);
            }
        }

        if (player.columnIndex === columns.length - 1) {
            alert("Félicitations ! Vous avez complété votre tâche en atteignant 'Done' !");
            gameOver = true;
        }
    }

    function draw() {
        console.log("Draw appelé");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner les colonnes
        ctx.fillStyle = "gray";
        for (let i = 0; i < columns.length; i++) {
            ctx.fillRect(columns[i] - 10, 0, 10, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillText(columnTitles[i], columns[i] - 20, 20);
        }

        // Dessiner le joueur
        ctx.fillStyle = "yellow";
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Dessiner les obstacles
        ctx.fillStyle = "red";
        for (let obs of obstacles) {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }

        // Dessiner les boosts
        ctx.fillStyle = "green";
        for (let boost of boosts) {
            ctx.fillRect(boost.x, boost.y, boost.width, boost.height);
        }
    }

    function gameLoop() {
        console.log("GameLoop appelé");
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Gestion des événements
    document.addEventListener("keydown", function(event) {
        if (event.code === "ArrowUp") {
            player.velocityY = -player.speedY;
        }
        if (event.code === "ArrowDown") {
            player.velocityY = player.speedY;
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.code === "ArrowUp" || event.code === "ArrowDown") {
            player.velocityY = 0;
        }
    });

    // Démarrage du jeu
    console.log("Démarrage du jeu");
    setInterval(spawnObstacle, 2000);
    setInterval(spawnBoost, 5000);
    gameLoop();
}); 