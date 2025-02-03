# Post-it Game - Document de Game Design

## Concept
Un jeu éducatif qui simule le flux de travail Kanban en utilisant des Post-its comme éléments de gameplay. Le joueur doit faire progresser des tickets (Post-its) à travers un tableau Kanban tout en gérant les obstacles et en optimisant sa vélocité.

## Objectif
Maximiser sa vélocité en faisant passer un maximum de story points en "Done" pendant la durée d'un sprint (60 secondes).

## Mécaniques de Base

### Tableau Kanban
- 4 colonnes : To Do, In Progress, Review, Done
- Les tickets doivent traverser les colonnes de gauche à droite
- Les tickets terminés s'empilent dans la colonne Done

### Post-its (Tickets)
- Représentés par des carrés jaunes
- Chaque ticket a une complexité (1, 2, 3, 5 ou 8 points)
- Un seul ticket actif à la fois
- Nouveau ticket généré automatiquement quand le précédent atteint Done

### Mouvements
- Déplacement vertical avec les flèches ↑↓
- Progression horizontale via les boosts de collaboration

## Éléments de Gameplay

### Boosts (Collaboration)
- Représentés par des carrés verts
- Permettent de faire avancer le ticket à la colonne suivante
- Apparaissent toutes les 5 secondes

### Obstacles (Impediments)
- Représentés par des carrés rouges
- Font reculer le ticket à la colonne précédente
- Game over si bloqué en To Do
- Apparaissent toutes les 2 secondes

### Score
- Basé sur les story points des tickets terminés
- Score total = somme des points des tickets en Done
- Affiché comme "Vélocité"

## Contrôles
- ↑ : Déplacer le Post-it vers le haut
- ↓ : Déplacer le Post-it vers le bas
- ESPACE : Démarrer le sprint / Mettre en pause

## États du Jeu
1. **Écran d'accueil (welcome)**
   - Premier écran au lancement du jeu
   - Affiche :
     - Titre du jeu
     - Objectif principal
     - Règles du jeu
     - Durée du sprint
     - Contrôles
     - Exemples visuels des éléments
   - Transition vers l'écran "Prêt ?" avec ESPACE

2. **Écran "Prêt ?" (playing, !sprintStarted)**
   - Écran de transition semi-transparent
   - Attend la confirmation du joueur
   - Démarre réellement le jeu au second appui sur ESPACE

3. **En jeu (playing, sprintStarted)**
   - Timer visible en haut
   - Score (Vélocité) visible en bas
   - Tickets terminés visibles dans Done
   - Spawns d'obstacles et de boosts actifs

4. **Pause (playing, gameIsPaused)**
   - Overlay semi-transparent
   - Timer et mouvements gelés
   - Reprise avec ESPACE

5. **Game Over**
   - Déclenché par :
     - Fin du sprint (60 secondes)
     - Impediment en To Do
   - Affiche le score final (Vélocité)

## Objectifs Pédagogiques
- Comprendre le flux de travail Kanban
- Visualiser l'importance de la collaboration
- Expérimenter l'impact des impediments
- Découvrir la notion de vélocité
- Sensibiliser à l'estimation en story points

## Extensions Futures Possibles
- Niveaux de difficulté
- Système de high scores
- Effets sonores
- Animations de collision
- Design plus élaboré des Post-its

## Interface Utilisateur
1. **Écran d'accueil**
   - Fond blanc avec zone de jeu gris clair
   - Texte noir centré
   - Exemples visuels des éléments :
     - Post-it jaune avec points
     - Boost vert
     - Impediment rouge
   - Instructions claires pour démarrer

2. **Zone de jeu**
   - Tableau Kanban avec 4 colonnes
   - Timer en haut
   - Score en bas
   - Post-its empilés dans Done 