class Position {
  constructor(row, cols) {
    this.row = row;
    this.cols = cols;
  }
}


class PiezaTetris {
  //Shape: Significa la forma de la pieza, que puede ser un cuadrado, una línea, una L, una T, etc.
  constructor(idcanva, sizecell, shapes = [], initPosition = new Position(), id = 1) {
    this.idcanva = idcanva; // ID del canvas
    this.sizecell = sizecell; // Tamaño de la celda
    this.shapes = shapes; // Forma de la pieza
    this.initPosition = initPosition; // Posición inicial de la pieza
    this.id = id; // ID de la pieza
    this.ctx = idcanva.getContext("2d"); // Contexto del canvas
    // Propiedad de rotacion de pieza
    this.rotation = 0;
    // Posición de la pieza en el canvas
    this.position = new Position(initPosition.row, initPosition.cols);
  }
  // Para dibujar la pieza necesitamos un molde
  //triangulo y cuadrado
  drawSquare(x, y, size, color) {
    this.ctx.fillStyle = color; // Color de la pieza
    this.ctx.fillRect(x, y, size, size); // Dibuja un cuadrado
  }

  drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath(); // Inicia un nuevo camino
    this.ctx.moveTo(x1, y1); // Mueve el cursor a la posición (x1, y1)
    this.ctx.lineTo(x2, y2); // Dibuja una línea hasta (x2, y2)
    this.ctx.lineTo(x3, y3); // Dibuja una línea hasta (x3, y3)
    this.ctx.closePath(); // Cierra el camino
    this.ctx.fill(); // Rellena el camino con el color especificado
  }
  // Paleta de colores de cada pieza
  getColorPalette(id) {
    const pallete = {
      1: "#FFDB01",
      2: "#FE8602",
      3: "#EE1B2E",
      4: "#24DC4F",
      5: "#2D97F7",
      6: "#0101F0",
      7: "#A000F1",
    }
    return pallete[id] || pallete[1]; // Devuelve el color correspondiente 
  }

  //Posicion donde dibujara el bloque
  drawBlock(x, y, id) {
    const margin = this.sizecell / 1; // Margen entre los bloques
    const pallete = this.getColorPalette(id); // Color de la pieza
    this.drawSquare(x + margin, y + margin, this.sizecell - (margin * 2), pallete); // Dibuja el bloque
  }

  // Retornara el conjunto de posiciones de la pieza
  currentShape() {
    return this.shapes[this.rotation]; // Devuelve la forma actual de la pieza
  }

  // Dibujar
  //Grid es la clase que contiene el tablero y con ello la funcion de la cordenada
  draw(grid) {
    const shape = this.currentShape(); // Obtiene la forma actual de la pieza
    for(let i = 0; i < shape.length; i++) {
      const { x, y } = grid.getCellCoordinates(
        this.position.cols + shape[i].cols, 
        this.position.row + shape[i].row
      ); // Obtiene la coordenada de la celda
      this.drawBlock(x, y, this.id); // Dibuja el bloque 
    }
  }

  // Lista de posiciones de la pieza
  currentPosition() {
    const position = [];
    const shape = this.currentShape(); // Obtiene la forma actual de la pieza
    for(let i = 0; i < shape.length; i++) {
      position.push(new Position(this.position.row + shape[i].row, this.position.cols + shape[i].cols)); // Agrega la posición de la pieza
    }
    return position;
  }
  // mover la pieza
  move(row, cols) {
    this.position.row += row;
    this.position.cols += cols;
  }

  // Reiniciar la pieza
  reset() {
    this.rotation = 0;
    this.position = new Position(this.initPosition.row, this.initPosition.cols); // Reinicia la posición de la pieza
  }
  // Volver a pintar la pieza


}


// Ahora las formas posibles de las piezas

const PiezaType = {
  T: {
    id: 1,
    initPosition: new Position(0, 3),
    shapes: [
      [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(1, 2)], // Forma inicial
      [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 1)], // Rotacion 90
      [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 1)], // Rotacion 180
      [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 1)] // Rotacion 270
    ]
  },
  O: {
    id: 2,
    initPosition: new Position(0, 4),
    shapes: [
      [new Position(0, 0), new Position(0, 1), new Position(1, 0), new Position(1, 1)], // Forma inicial
    ]
  },
  I: {
    id: 3,
    initPosition: new Position(-1, 3),
    shapes: [
      [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(1, 3)], // Forma inicial
      [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2)], // Rotacion 90
      [new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(2, 3)], // Rotacion 180
      [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1)] // Rotacion 270
    ]
  },
  S: {
    id: 4,
    initPosition: new Position(0, 3),
    shapes: [
      [new Position(0, 1), new Position(0, 2), new Position(1, 0), new Position(1, 1)], // Forma inicial
      [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 2)], // Rotacion 90
      [new Position(1, 1), new Position(1, 2), new Position(2, 0), new Position(2, 1)], // Rotacion 180
      [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)] // Rotacion 270
    ]
  },
  Z: {
    id: 5,
    initPosition: new Position(0, 3),
    shapes: [
      [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(1, 2)], // Forma inicial
      [new Position(0, 2), new Position(1, 1), new Position(1, 2), new Position(2, 1)], // Rotacion 90
      [new Position(1, 0), new Position(1, 1), new Position(2, 1), new Position(2, 2)], // Rotacion 180
      [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 0)] // Rotacion 270
    ]
  },
  J: {
    id: 6,
    initPosition: new Position(0, 3),
    shapes: [
      [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(1, 2)], // Forma inicial
      [new Position(0, 1), new Position(0, 2), new Position(1, 1), new Position(2, 1)], // Rotacion 90
      [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 2)], // Rotacion 180
      [new Position(0, 1), new Position(1, 1), new Position(2, 0), new Position(2, 1)] // Rotacion 270
    ]
  },
  L: {
    id: 7,
    initPosition: new Position(0, 3),
    shapes: [
      [new Position(0, 2), new Position(1, 0), new Position(1, 1), new Position(1, 2)], // Forma inicial
      [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(2, 2)], // Rotacion 90
      [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 0)], // Rotacion 180
      [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)] // Rotacion 270
    ]
  }
}

// crearemos una bolsa de piezas para que el juego sea mas dinamico

class PiezasBag {
  constructor(idcanva, sizecells) {
    this.idcanva = idcanva; // ID del canvas
    this.sizecells = sizecells; // Tamaño de la celda
    this.bag = []; // Bolsa de piezas
    // this.createBag(); // Crea la bolsa de piezas
    this.threeNextPiezas = []; // Almacena las tres siguientes piezas
    this.init();
  }
  init() {
    for(let i = 0; i < 3; i++) {
      this.threeNextPiezas.push(this.getnextPieza()); // Agrega la siguiente pieza a la bolsa
    }
  }
  createBag() {
    const {T, O, I, S, Z, J, L} = PiezaType;
    const tiposPiezas = [T, O, I, S, Z, J, L];
    this.bag.length = 0;
    tiposPiezas.forEach((pieza) => {
      this.bag.push(new PiezaTetris(this.idcanva, this.sizecells, pieza.shapes, pieza.initPosition, pieza.id)); // Agrega la pieza a la bolsa
    })

    // Mezclamos la bolsa de piezas
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Genera un numero aleatorio
      //mezcla un numero aleatorio con las posiciones ultimas para mezclarlo
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]; // Intercambia las piezas
    }
  }
  getnextPieza() {
    if (this.bag.length === 0) {
      this.createBag(); // Si la bolsa esta vacia, crea una nueva bolsa
    }
    return this.bag.pop(); // Devuelve la ultima pieza de la bolsa
  }
  // Metodo para sacar una siguiente pieza de la bolsa
  nextPieza() {
    const next = this.threeNextPiezas.shift(); // Saca la primera pieza de la bolsa
    this.threeNextPiezas.push(this.getnextPieza()); // Agrega la siguiente pieza a la bolsa
    return next;
  }
  getThreeNextPiezas() {
    return this.threeNextPiezas; // Devuelve las tres siguientes piezas
  }
  reset() {
    this.bag = [];
    this.threeNextPiezas = [];
    this.init();
  }
}

export {Position, PiezaTetris, PiezaType, PiezasBag};