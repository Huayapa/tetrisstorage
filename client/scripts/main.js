import { Game } from "./game.js";
const mainTetris = document.getElementById('tablegame');
const nextTetris = document.getElementById('nextgame');
const holdTetris = document.getElementById('holdgame');
const score = document.getElementById('score');
const options = {
  rows: 20,
  cols: 10,
  size: 30,
  space: 2,
}
const game = new Game(mainTetris, options.rows, options.cols, options.size, options.space, nextTetris, holdTetris); // Crear el juego
// Animar el tablero de forma recursiva
function actualizar() {
  if(game.gameOver) {
    alert("Game Over"); // Mostrar mensaje de game over
    game.reset();
  } else {
    game.update(); // Actualizar el juego
    score.innerHTML = game.score; // Actualizar el puntaje
  }
  requestAnimationFrame(actualizar);
}

actualizar(); // Iniciar la animación