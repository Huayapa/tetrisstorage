import { Grid } from "./grid.js";

export class BoardTetris extends Grid {
  constructor(idcanva, numrows, numcols, sizecells, space) {
    super(idcanva, numrows, numcols, sizecells, space);
  }

  // Verificar si la celda esta dentro del rango de la matriz
  isInside(row,col) {
    return row >= 0 && row < this.numrows && col >= 0 && col < this.numcols;
  }
  // Verificar si la celda esta vacia
  isEmpty(row, col) {
    return this.isInside(row, col) && this.matriz[row][col] === 0 ;
  }
  //Verificar si esta la linea llena
  isRowFull(row) {
    return this.matriz[row].every(cell => cell !== 0);
  }
  // Verificar si esta vacia
  isRowEmpty(row) {
    return this.matriz[row].every(cell => cell === 0);
  }
  // Limpiar fila (cambiar el valor de la fila a 0)
  clearRow(row) {
      this.matriz[row].fill(0);
  }
  // Mover fila abajo
  moveRowDown(row, numrows) {
    this.matriz[row + numrows] = this.matriz[row].slice(); // Copiar la fila
    this.clearRow(row); // Limpiar la fila
  }
  // Limpiar fils llens
  clearFullRows() {
    let cont = 0;
    for (let r = this.numrows - 1; r >= 0; r--) {
      if (this.isRowFull(r)) {
        this.clearRow(r); // Limpiar la fila
        cont++; // Contar la fila llena
      } else if (cont > 0) {
        this.moveRowDown(r, cont); // Mover la fila llena hacia abajo
      }
    }
    return cont;
  }
  // Metodo para ver si termino
  gameOver() {
    return !(this.isRowEmpty(0));
  }
}

export class BoardNext extends Grid {
  constructor(idcanva, numrows, numcols, sizecells, space, listPieza) {
    super(idcanva, numrows, numcols, sizecells, space);
    this.listPieza = listPieza; // Lista de piezas
    this.updateMatriz();
  }
  updateMatriz() {
    this.restartMatriz(); // Reiniciar la matriz
    let cont = 0;
    for (let i = 0; i < this.listPieza.length; i++) {
      const shape = this.listPieza[i].currentShape();
      for (let j = 0; j < shape.length; j++) {
        this.matriz[shape[j].row + cont][shape[j].cols] = this.listPieza[i].id; 
        
      }
      cont+=3;
    }
  }
}

export class BoardHold extends Grid {
  constructor(idcanva, numrows, numcols, sizecells, space) {
    super(idcanva, numrows, numcols, sizecells, space);
    this.pieza = null; // Lista de piezas
    this.updateMatriz();
  }
  updateMatriz() {
    if(this.pieza == null) return;
    this.pieza.reset();
    this.restartMatriz(); // Reiniciar la matriz
    const shape = this.pieza.currentShape();
    for (let i = 0; i < shape.length; i++) {
      this.matriz[shape[i].row][shape[i].cols] = this.pieza.id; 
    }
  }
  replacePieza(pieza) {
    this.pieza = pieza; // Asignar la pieza
    this.updateMatriz(); // Actualizar la matriz
  }
}