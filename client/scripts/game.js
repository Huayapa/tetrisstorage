import {PiezasBag, PiezaTetris } from "./piezas.js";
import { BoardTetris, BoardNext, BoardHold } from "./boardtetris.js";
export class Game {
  constructor(idcanva, numrows, numcols, sizecells, space, canvasnext, canvasHold) {
    this.boardTetris = new BoardTetris(idcanva, numrows, numcols, sizecells, space);
    this.piezaBag = new PiezasBag(idcanva, sizecells)
    
    this.next = new BoardNext(canvasnext, 8, 4, sizecells, space, this.piezaBag.getThreeNextPiezas()); // Siguiente pieza
    this.hold = new BoardHold(canvasHold, 2, 4, sizecells, space);
    this.canHold = true;
    
    // Almacenar la pieza
    // if (!this.currentPieza) {
    //   this.currentPieza = this.piezaBag.nextPieza();
    // }
    // Obtener una pieza aleatoria
    this.keyboard(); // Iniciar el teclado
    this.keys = {up: false, down: false};
    
    this.lastTime = 0; // Almacenar el tiempo
    this.lastTime2 = 0; // Almacenar el tiempo
    
    // CONTAR PUNTAJE
    this.score = 0; // Almacenar el puntaje
    this.gameOver = false; // Almacenar el estado del juego
    // Cargar estado de guardado desde local storage
    const loaded = this.loadGameState();
    // Solo si no hay estado guardado, inicializamos nuevo juego
    if (!loaded) {
        this.currentPieza = this.piezaBag.nextPieza();
        this.next.listPieza = this.piezaBag.getThreeNextPiezas();
        this.next.updateMatriz();
    }
    // this.loadGameState();
    // Guardar cuando se cierra la pestaña
    window.addEventListener("beforeunload", () => {
      this.saveGame();
    });
  }
  update() {
    
    let currentTime = Date.now(); // Obtener el tiempo actual
    let deltaTime = currentTime - this.lastTime;
    let deltaTime2 = currentTime - this.lastTime;
    if(deltaTime >= 1000) {
      this.autoMovePiezaDown(); // Mover la pieza hacia abajo
      this.lastTime = currentTime; // Actualizar el tiempo
      this.saveGame();
    }
    if(deltaTime2 >= 50) {
      this.boardTetris.draw(); // Dibujar el tablero
      this.drawPiezaGhost();
      this.currentPieza.draw(this.boardTetris); // Dibujar la pieza

      this.next.draw2();
      this.hold.draw2();

      if(this.keys.down) {
        this.movePiezaDown(); // Mover la pieza hacia abajo
      }
      this.lastTime2 = currentTime; 
    }
  }
  autoMovePiezaDown() {
    this.currentPieza.move(1, 0);
    if (this.blockedPieza()) {
      this.currentPieza.move(-1, 0);
      this.placePieza();
    }
  }
  // Verificar si la pieza esta bloqueada
  blockedPieza() {
    const piezaPosicion = this.currentPieza.currentPosition(); // Obtener la posicion de la pieza
    for (let i = 0; i < piezaPosicion.length; i++) {
      const { row, cols } = piezaPosicion[i]; // Obtener la posicion de la pieza
      if (!this.boardTetris.isEmpty(row, cols)) { // Verificar si la celda esta vacia
        return true; // Si no esta vacia retornar true
      }
    }
    return false;
  }
  // Mover la pieza 
  movePiezaLeft() {
    this.currentPieza.move(0, -1); // Mover la pieza hacia la izquierda
    if (this.blockedPieza()) { // Verificar si la pieza esta bloqueada
      this.currentPieza.move(0, 1);
    }
  }
  movePiezaRight() {
    this.currentPieza.move(0, 1);
    if (this.blockedPieza()) {
      this.currentPieza.move(0, -1);
    }
  }
  movePiezaDown() {
    this.currentPieza.move(1, 0);
    if (this.blockedPieza()) {
      this.currentPieza.move(-1, 0);
    }
  }

  rotationPiezaCW() {
    this.currentPieza.rotation++;
    if (this.currentPieza.rotation > this.currentPieza.shapes.length - 1) {
      this.currentPieza.rotation = 0; // Reiniciar la rotacion
    }
    if(this.blockedPieza()) {
      this.rotationPiezaCCW();
    }
  }
  rotationPiezaCCW() {
    this.currentPieza.rotation--;
    if(this.currentPieza.rotation < 0) {
      this.currentPieza.rotation = this.currentPieza.shapes.length - 1; // Reiniciar la rotacion
    }
    if(this.blockedPieza()) {
      this.rotationPiezaCW();
    }
  }
  // 
  placePieza() {
    const piezaPosicion = this.currentPieza.currentPosition(); // Obtener la posicion de la pieza
    for (let i = 0; i < piezaPosicion.length; i++) {
      const { row, cols } = piezaPosicion[i]; // Obtener la posicion de la pieza
      this.boardTetris.matriz[row][cols] = this.currentPieza.id; // Colocar la pieza en el tablero
    }
    this.score += this.boardTetris.clearFullRows() * 10; // Limpiar las filas llenas
    if(this.boardTetris.gameOver()) {
      setTimeout(() => {
        this.gameOver = true; // Si el juego termina, cambiar el estado
      }, 500);
      return true;
    } else { 
      // this.currentPieza = this.next.listPieza.shift();
      
      this.currentPieza = this.piezaBag.nextPieza();
      this.next.listPieza = this.piezaBag.getThreeNextPiezas(); // Obtener la siguiente pieza
      this.next.updateMatriz(); // Actualizar la matriz
      this.canHold = true; // Reiniciar la variable
    }

  }
  //Encontrar la distancia de caida
  dropDistance(position) {
    let distance = 0;
    while(this.boardTetris.isEmpty(position.row + distance  + 1, position.cols)) {
      distance++;
    }
    return distance;
  }
  // Obtener la distancia
  piezaDropDistance() {
    let drop = this.boardTetris.numrows;
    const piezaPosicion = this.currentPieza.currentPosition(); // Obtener la posicion de la pieza
    for(let i = 0; i < piezaPosicion.length; i++) {
      drop = Math.min(drop, this.dropDistance(piezaPosicion[i])); // Obtener la distancia de la pieza
    }
    return drop;
  }
  // Dibujar la pieza fantasma
  drawPiezaGhost() {
    const drop = this.piezaDropDistance(); // Obtener la distancia de la pieza
    const piezaPosicion = this.currentPieza.currentPosition(); // Obtener la posicion de la pieza
    for(let i = 0; i < piezaPosicion.length; i++) {
      const { x, y } = this.boardTetris.getCellCoordinates(
        piezaPosicion[i].cols, 
        piezaPosicion[i].row + drop
      );
      this.boardTetris.drawSquare(x, y, this.boardTetris.sizecells, "#000", "#39ff14", 20); // Dibujar la pieza fantasma
    }
  }
  // Hacer que el bloque caiga directamente abajo
  dropPieza() {
    this.currentPieza.move(this.piezaDropDistance(), 0); // Mover la pieza hacia abajo
    this.placePieza();
  }
  // Guardar la pieza
  holdPieza() {
    if(!this.canHold) return;
    if(this.hold.pieza == null) {
      this.hold.pieza = this.currentPieza;
      this.currentPieza = this.piezaBag.nextPieza();
    } else {
      // Intercambiar la pieza actual con la pieza guardada
      [this.currentPieza, this.hold.pieza] = [this.hold.pieza, this.currentPieza];
    }
    this.hold.updateMatriz();
    this.canHold = false; // Desactivar el intercambio de pieza
  }
  // Reiniciar el juego
  reset() {
    localStorage.removeItem("tetrisGameState"); // Eliminar el estado guardado
    this.gameOver = false; // Reiniciar el estado del juego
    this.boardTetris.restartMatriz(); // Reiniciar el tablero
    this.score = 0; // Reiniciar el puntaje
    this.hold.pieza = null; // Reiniciar el hold
    this.piezaBag.reset(); // Reiniciar la bolsa de piezas
    this.currentPieza = this.piezaBag.nextPieza(); // Obtener una pieza aleatoria
    

    this.canHold = true; // Reiniciar la variable
    this.hold.restartMatriz(); // Actualizar la matriz
    this.next.restartMatriz();
    this.next.listPieza = this.piezaBag.getThreeNextPiezas();
    this.next.updateMatriz();
    this.next.draw2();
  }
  // Eventos del teclado
  keyboard() {
    // teclas de mobile
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    const down = document.getElementById("down");
    const rotate = document.getElementById("rotate");
    const drop = document.getElementById("drop");
    const hold = document.getElementById("holdclick");

    //eventos
    window.addEventListener("keydown", (event) => {
      if((event.key === "w" || event.key === "W") && !this.keys.up) {
        this.rotationPiezaCW(); // Rotar la pieza hacia la izquierda
        this.keys.up = true;
      }
      if(event.key === "c" || event.key === "C") {
        this.holdPieza(); // Guardar la pieza
      }
      if(event.key === "m" || event.key === "M") {
        if(!this.gameOver){
          this.dropPieza();
        }
      }
      switch (event.key) {
        case "a":
          this.movePiezaLeft(); // Mover la pieza hacia la izquierda
          break;
        case "d":
          this.movePiezaRight(); // Mover la pieza hacia la derecha
          break;
        case "s":
          this.keys.down = true; // Almacenar la tecla
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "w":
          this.keys.up = false; // Almacenar la tecla
          break;
        case "s":
          this.keys.down = false; // Almacenar la tecla
          break;
      }
    })
    window.addEventListener("click", (event) => {
      if(event.target === left) {
        this.movePiezaLeft(); // Mover la pieza hacia la izquierda
      }
      if(event.target === right) {
        this.movePiezaRight(); // Mover la pieza hacia la derecha
      }
      if(event.target === down) {
        this.movePiezaDown(); // Mover la pieza hacia abajo
      }
      if(event.target === rotate) {
        this.rotationPiezaCW(); // Rotar la pieza hacia la izquierda
      }
      if(event.target === drop) {
        this.dropPieza(); // Hacer que la pieza caiga
      }
      if(event.target === hold) {
        this.holdPieza(); // Guardar la pieza
      }
    })
  }

  // !METODO PARA GUARDAR LA PARTIDA COMPLETA EN LOCAL STORAGE
  saveGame() {
    const gameData = {
      idcanva: this.boardTetris.idcanva.outerHTML,
      score: this.score,
      gameOver: this.gameOver,
      board: this.boardTetris.matriz,
      holdPiece: this.hold.pieza,
      currentPiece: this.currentPieza,
      nextPieces: this.next.listPieza,
      pieceBag: this.piezaBag.bag,
    };
    
    localStorage.setItem("tetrisGameState", JSON.stringify(gameData)); // Guardar la partida en local storage
  }
  // Método para cargar el estado
  loadGameState() {
    const savedState = localStorage.getItem('tetrisGameState');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      console.log(this.piezaBag.bag);
      console.log(this.next.listPieza);
      console.log(this.piezaBag.threeNextPiezas);
      
      this.score = gameState.score || 0;
      this.gameOver = gameState.gameOver || false;
      if(gameState.pieceBag) {
        this.piezaBag.reset();
        this.piezaBag.bag = gameState.pieceBag.map((piece) => {
          return new PiezaTetris(this.boardTetris.idcanva, piece.sizecell, piece.shapes, piece.initPosition, piece.id);
        });
        this.next.updateMatriz();
      }
      if(gameState.nextPieces) {
        this.next.listPieza = gameState.nextPieces.map((piece) => {
          return new PiezaTetris(this.boardTetris.idcanva, piece.sizecell, piece.shapes, piece.initPosition, piece.id);
        });
        this.piezaBag.threeNextPiezas = this.next.listPieza;
        this.next.updateMatriz();
      }
      //Cargar el tablero
      if (gameState.board) {
        this.boardTetris.matriz = gameState.board;
      }
      // CARGAMOS EL HOLD
      if(gameState.holdPiece !== null) {
        const {sizecell, shapes, initPosition, id} = gameState.holdPiece;
        this.hold.pieza = new PiezaTetris(this.boardTetris.idcanva, sizecell, shapes, initPosition, id);
        this.hold.updateMatriz(); // Actualizar la matriz

      }
      
      if(gameState.currentPiece) {
        const {sizecell, shapes, initPosition, id, rotation, position} = gameState.currentPiece;
        this.currentPieza = new PiezaTetris(this.boardTetris.idcanva, sizecell, shapes, initPosition, id);
        this.currentPieza.rotation = rotation || 0;
        this.currentPieza.position = position || initPosition; 
      }
      
      return true;
    }
    return false;
  }

}