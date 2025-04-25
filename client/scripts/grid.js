import { PiezaTetris } from "./piezas.js";

export class Grid {
  constructor(idcanva, numrows, numcols, sizecells, space) {
    this.idcanva = idcanva;
    this.numrows = numrows;
    this.numcols = numcols;
    this.sizecells = sizecells;
    this.space = space; // Espacio entre celdas 
    // Dibujar la matriz de celdas
    this.ctx = idcanva.getContext("2d");
    this.matriz = [];
    // Reiniciar matriz de celdas
    this.restartMatriz();
    // Ajustar el tamaño del canvas
    idcanva.width = numcols * sizecells + (space * numcols);
    idcanva.height = numrows * sizecells + (space * numrows);
    // CREAR PIEZA
    this.block = new PiezaTetris(idcanva, sizecells);
  }

  // Llenar la matriz de celdas
  restartMatriz() {
    // En cada columna llena la matriz de celdas con 0
    for (let r = 0; r < this.numrows; r++) {
      this.matriz[r] = [];
      for (let c = 0; c < this.numcols; c++) {
        this.matriz[r][c] = 0;
      }
    }
  }
  // Dibujar la matriz de celdas
  drawSquare(x, y, sizeBox ,color, bordercolor, border) {
    const borderSize = sizeBox / border;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, sizeBox, sizeBox);

    this.ctx.strokeStyle = bordercolor;
    this.ctx.lineWidth = borderSize;
    this.ctx.strokeRect(x + borderSize / 2, y + borderSize / 2, sizeBox - borderSize, sizeBox - borderSize);
  }

  // Obtener la cordenada de la celda
  getCellCoordinates(col, row) {
    const cellX = col * (this.sizecells + this.space);
    const cellY = row * (this.sizecells + this.space);
    return { x: cellX, y: cellY };
  }

  // Dibujar tablero
  draw() {
    // Recorrera las filas y columnas de la matriz para pintarlo
    for (let r = 0; r < this.numrows; r++) {
      for (let c = 0; c < this.numcols; c++) {
        const { x, y } = this.getCellCoordinates(c, r); // Obtener la coordenada de la celda
        // this.drawSquare(x, y, this.sizecells, "black", "#1d1d1d", 20);

        // Verificar si es diferente a cero para pintarlo
        if(this.matriz[r][c] !== 0) {
          this.block.drawBlock(x, y, this.matriz[r][c]); // Dibuja el bloque 
        } else {
          this.drawSquare(x, y, this.sizecells, "black", "#1d1d1d", 20);
        }
      }
    }
  }

  draw2() {
    this.drawBackground();
    for (let r = 0; r < this.numrows; r++) {
      for (let c = 0; c < this.numcols; c++) {
        const { x, y } = this.getCellCoordinates(c, r); // Obtener la coordenada de la celda
        // this.drawSquare(x, y, this.sizecells, "black", "#1d1d1d", 20);

        // Verificar si es diferente a cero para pintarlo
        if(this.matriz[r][c] !== 0) {
          this.block.drawBlock(x, y, this.matriz[r][c]); // Dibuja el bloque 
        }
      }
    }
  }
  drawBackground() {
    this.ctx.fillStyle = "black"; // Color de fondo
    this.ctx.fillRect(0,0, this.idcanva.width, this.idcanva.height); // Dibuja el fondo
  }
  // Dibujar tablero en consola
  drawConsole() {
    console.log("Tablero: ");
    for (let r = 0; r < this.numrows; r++) {
      let row = "";
      for (let c = 0; c < this.numcols; c++) {
        row += this.matriz[r][c] + " ";
      }
      console.log(row);
    }
  }
}