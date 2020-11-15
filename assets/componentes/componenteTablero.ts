import ComponenteBase from 'motor/logica/componentes/componenteBase';
import {
  pawnBoard,
  rookBoard,
  knightBoard,
  bishopBoard,
  queenBoard,
  kingEndBoard,
  kingMidBoard,
} from 'assets/componentes/chessRating';

export default class ComponenteTablero extends ComponenteBase {
  public readonly defaultChessBoard: string[][] = [
    ['r', 'k', 'b', 'q', 'a', 'b', 'k', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'K', 'B', 'Q', 'A', 'B', 'K', 'R'],
  ];
  public chessBoard: string[][];
  public kingPositionC: number = 0;
  public kingPositionL: number = 0;
  public humanAsWhite: number = 1; //1=human as white, 0=human as black
  public static globalDepth: number = 2;

  public cargarConfiguracion(): void {
    this.chessBoard = this.cloneBoard(this.defaultChessBoard);

    while ('A' !== this.chessBoard[Math.floor(this.kingPositionC / 8)][this.kingPositionC % 8]) {
      this.kingPositionC++;
    } //get King's location
    while ('a' !== this.chessBoard[Math.floor(this.kingPositionL / 8)][this.kingPositionL % 8]) {
      this.kingPositionL++;
    } //get king's location
    /*
     * PIECE=WHITE/black
     * pawn=P/p
     * kinght (horse)=K/k
     * bishop=B/b
     * rook (castle)=R/r
     * Queen=Q/q
     * King=A/a
     *
     * My strategy is to create an alpha-beta tree diagram wich returns
     * the best outcome
     *
     * (1234b represents row1,column2 moves to row3, column4 which captured
     * b (a space represents no capture))
     */    
  }

  public cloneBoard(board: string[][]): string[][] {
    const cloned: string[][] = new Array();
    board.forEach(e => {
      cloned.push([...e]); 
    });
    return cloned;
  }

  public primerMovimiento(): void {
    if (this.humanAsWhite === 0) {
      this.makeMove(this.alphaBeta(ComponenteTablero.globalDepth, 1000000, -1000000, '', 0));
      this.flipBoard();
    }
  }

  public alphaBeta(
    depth: number,
    beta: number,
    alpha: number,
    move: string,
    player: number,
  ): string {
    //return in the form of 1234b##########
    let list: string = this.posibleMoves();
    if (depth === 0 || list.length === 0) {
      return move + this.rating(list.length, depth) * (player * 2 - 1);
    }
    list = this.sortMoves(list);
    player = 1 - player; //either 1 or 0
    for (let i: number = 0; i < list.length; i += 5) {
      this.makeMove(list.substring(i, i + 5));
      this.flipBoard();
      let returnString: string = this.alphaBeta(
        depth - 1,
        beta,
        alpha,
        list.substring(i, i + 5),
        player,
      );
      let value: number = Number(returnString.substring(5));
      this.flipBoard();
      this.undoMove(list.substring(i, i + 5));
      if (player === 0) {
        if (value <= beta) {
          beta = value;
          if (depth === ComponenteTablero.globalDepth) {
            move = returnString.substring(0, 5);
          }
        }
      } else {
        if (value > alpha) {
          alpha = value;
          if (depth === ComponenteTablero.globalDepth) {
            move = returnString.substring(0, 5);
          }
        }
      }
      if (alpha >= beta) {
        if (player === 0) {
          return move + beta;
        } else {
          return move + alpha;
        }
      }
    }
    if (player === 0) {
      return move + beta;
    } else {
      return move + alpha;
    }
  }

  public flipBoard(): void {
    let temp: string;
    for (let i: number = 0; i < 32; i++) {
      let r: number = Math.floor(i / 8);
      let c: number = i % 8;
      if (this.esMayuscula(this.chessBoard[r][c])) {
        temp = this.chessBoard[r][c].toLowerCase();
      } else {
        temp = this.chessBoard[r][c].toUpperCase();
      }
      if (this.esMayuscula(this.chessBoard[7 - r][7 - c])) {
        this.chessBoard[r][c] = this.chessBoard[7 - r][7 - c].toLowerCase();
      } else {
        this.chessBoard[r][c] = this.chessBoard[7 - r][7 - c].toUpperCase();
      }
      this.chessBoard[7 - r][7 - c] = temp;
    }
    const kingTemp: number = this.kingPositionC;
    this.kingPositionC = 63 - this.kingPositionL;
    this.kingPositionL = 63 - kingTemp;
  }

  public makeMove(move: string) {
    if (move.charAt(4) !== 'P') {
      this.chessBoard[this.obtenerValorNumerico(move.charAt(2))][
        this.obtenerValorNumerico(move.charAt(3))
      ] = this.chessBoard[this.obtenerValorNumerico(move.charAt(0))][
        this.obtenerValorNumerico(move.charAt(1))
      ];
      this.chessBoard[this.obtenerValorNumerico(move.charAt(0))][
        this.obtenerValorNumerico(move.charAt(1))
      ] = ' ';
      if (
        'A' ===
        this.chessBoard[this.obtenerValorNumerico(move.charAt(2))][
          this.obtenerValorNumerico(move.charAt(3))
        ]
      ) {
        this.kingPositionC =
          8 * this.obtenerValorNumerico(move.charAt(2)) + this.obtenerValorNumerico(move.charAt(3));
      }
    } else {
      //if pawn promotion
      this.chessBoard[1][this.obtenerValorNumerico(move.charAt(0))] = ' ';
      this.chessBoard[0][this.obtenerValorNumerico(move.charAt(1))] = String(move.charAt(3));
    }    
  }

  private undoMove(move: string) {
    if (move.charAt(4) !== 'P') {
      this.chessBoard[this.obtenerValorNumerico(move.charAt(0))][
        this.obtenerValorNumerico(move.charAt(1))
      ] = this.chessBoard[this.obtenerValorNumerico(move.charAt(2))][
        this.obtenerValorNumerico(move.charAt(3))
      ];
      this.chessBoard[this.obtenerValorNumerico(move.charAt(2))][
        this.obtenerValorNumerico(move.charAt(3))
      ] = String(move.charAt(4));
      if (
        'A' ===
        this.chessBoard[this.obtenerValorNumerico(move.charAt(0))][
          this.obtenerValorNumerico(move.charAt(1))
        ]
      ) {
        this.kingPositionC =
          8 * this.obtenerValorNumerico(move.charAt(0)) + this.obtenerValorNumerico(move.charAt(1));
      }
    } else {
      //if pawn promotion
      this.chessBoard[1][this.obtenerValorNumerico(move.charAt(0))] = 'P';
      this.chessBoard[0][this.obtenerValorNumerico(move.charAt(1))] = String(move.charAt(2));
    }
  }

  public posibleMoves(): string {
    let list: string = '';
    for (let i: number = 0; i < 64; i++) {
      switch (this.chessBoard[Math.floor(i / 8)][i % 8]) {
        case 'P':
          list += this.posibleP(i);
          break;
        case 'R':
          list += this.posibleR(i);
          break;
        case 'K':
          list += this.posibleK(i);
          break;
        case 'B':
          list += this.posibleB(i);
          break;
        case 'Q':
          list += this.posibleQ(i);
          break;
        case 'A':
          list += this.posibleA(i);
          break;
      }
    }
    return list; //x1,y1,x2,y2,captured piece
  }

  private posibleP(i: number): string {
    let list: string ='';
    let oldPiece: string;
    const r: number = Math.floor(i / 8);
    const c: number = i % 8;
    for (let j: number = -1; j <= 1; j += 2) {
      try {
        //capture
        if (this.esMinuscula(this.chessBoard[r - 1][c + j]) && i >= 16) {
          oldPiece = this.chessBoard[r - 1][c + j];
          this.chessBoard[r][c] = ' ';
          this.chessBoard[r - 1][c + j] = 'P';
          if (this.kingSafe()) {
            list = list + r + c + (r - 1) + (c + j) + oldPiece;
          }
          this.chessBoard[r][c] = 'P';
          this.chessBoard[r - 1][c + j] = oldPiece;
        }
      } catch (e) {}
      try {
        //promotion && capture
        if (this.esMinuscula(this.chessBoard[r - 1][c + j]) && i < 16) {
          const temp: string[] = ['Q', 'R', 'B', 'K'];
          for (let k: number = 0; k < 4; k++) {
            oldPiece = this.chessBoard[r - 1][c + j];
            this.chessBoard[r][c] = ' ';
            this.chessBoard[r - 1][c + j] = temp[k];
            if (this.kingSafe()) {
              //column1,column2,captured-piece,new-piece,P
              list = list + c + (c + j) + oldPiece + temp[k] + 'P';
            }
            this.chessBoard[r][c] = 'P';
            this.chessBoard[r - 1][c + j] = oldPiece;
          }
        }
      } catch (e) {}
    }
    try {
      //move one up
      if (' ' === this.chessBoard[r - 1][c] && i >= 16) {
        oldPiece = this.chessBoard[r - 1][c];
        this.chessBoard[r][c] = ' ';
        this.chessBoard[r - 1][c] = 'P';
        if (this.kingSafe()) {
          list = list + r + c + (r - 1) + c + oldPiece;
        }
        this.chessBoard[r][c] = 'P';
        this.chessBoard[r - 1][c] = oldPiece;
      }
    } catch (e) {}
    try {
      //promotion && no capture
      if (' ' === this.chessBoard[r - 1][c] && i < 16) {
        const temp: string[] = ['Q', 'R', 'B', 'K'];
        for (let k: number = 0; k < 4; k++) {
          oldPiece = this.chessBoard[r - 1][c];
          this.chessBoard[r][c] = ' ';
          this.chessBoard[r - 1][c] = temp[k];
          if (this.kingSafe()) {
            //column1,column2,captured-piece,new-piece,P
            list = list + c + c + oldPiece + temp[k] + 'P';
          }
          this.chessBoard[r][c] = 'P';
          this.chessBoard[r - 1][c] = oldPiece;
        }
      }
    } catch (e) {}
    try {
      //move two up
      if (' ' === this.chessBoard[r - 1][c] && ' ' === this.chessBoard[r - 2][c] && i >= 48) {
        oldPiece = this.chessBoard[r - 2][c];
        this.chessBoard[r][c] = ' ';
        this.chessBoard[r - 2][c] = 'P';
        if (this.kingSafe()) {
          list = list + r + c + (r - 2) + c + oldPiece;
        }
        this.chessBoard[r][c] = 'P';
        this.chessBoard[r - 2][c] = oldPiece;
      }
    } catch (e) {}
    return list;
  }

  private posibleR(i: number): string {
    let list: string = '';
    let oldPiece: string = '';
    let r: number = Math.floor(i / 8);
    let c: number = i % 8;
    let temp: number = 1;
    for (let j: number = -1; j <= 1; j += 2) {
      try {
        while (' ' === this.chessBoard[r][c + temp * j]) {
          oldPiece = this.chessBoard[r][c + temp * j];
          this.chessBoard[r][c] = ' ';
          this.chessBoard[r][c + temp * j] = 'R';
          if (this.kingSafe()) {
            list = list + r + c + r + (c + temp * j) + oldPiece;
          }
          this.chessBoard[r][c] = 'R';
          this.chessBoard[r][c + temp * j] = oldPiece;
          temp++;
        }
        if (this.esMinuscula(this.chessBoard[r][c + temp * j])) {
          oldPiece = this.chessBoard[r][c + temp * j];
          this.chessBoard[r][c] = ' ';
          this.chessBoard[r][c + temp * j] = 'R';
          if (this.kingSafe()) {
            list = list + r + c + r + (c + temp * j) + oldPiece;
          }
          this.chessBoard[r][c] = 'R';
          this.chessBoard[r][c + temp * j] = oldPiece;
        }
      } catch (e) {}
      temp = 1;
      try {
        while (' ' === this.chessBoard[r + temp * j][c]) {
          oldPiece = this.chessBoard[r + temp * j][c];
          this.chessBoard[r][c] = ' ';
          this.chessBoard[r + temp * j][c] = 'R';
          if (this.kingSafe()) {
            list = list + r + c + (r + temp * j) + c + oldPiece;
          }
          this.chessBoard[r][c] = 'R';
          this.chessBoard[r + temp * j][c] = oldPiece;
          temp++;
        }
        if (this.esMinuscula(this.chessBoard[r + temp * j][c])) {
          oldPiece = this.chessBoard[r + temp * j][c];
          this.chessBoard[r][c] = ' ';
          this.chessBoard[r + temp * j][c] = 'R';
          if (this.kingSafe()) {
            list = list + r + c + (r + temp * j) + c + oldPiece;
          }
          this.chessBoard[r][c] = 'R';
          this.chessBoard[r + temp * j][c] = oldPiece;
        }
      } catch (e) {}
      temp = 1;
    }
    return list;
  }

  private posibleK(i: number): string {
    let list: string = '';
    let oldPiece: string = '';
    let r: number = Math.floor(i / 8);
    let c: number = i % 8;
    for (let j: number = -1; j <= 1; j += 2) {
      for (let k: number = -1; k <= 1; k += 2) {
        try {
          if (
            this.esMinuscula(this.chessBoard[r + j][c + k * 2]) ||
            ' ' === this.chessBoard[r + j][c + k * 2]
          ) {
            oldPiece = this.chessBoard[r + j][c + k * 2];
            this.chessBoard[r][c] = ' ';
            if (this.kingSafe()) {
              list = list + r + c + (r + j) + (c + k * 2) + oldPiece;
            }
            this.chessBoard[r][c] = 'K';
            this.chessBoard[r + j][c + k * 2] = oldPiece;
          }
        } catch (e) {}
        try {
          if (
            this.esMinuscula(this.chessBoard[r + j * 2][c + k]) ||
            ' ' === this.chessBoard[r + j * 2][c + k]
          ) {
            oldPiece = this.chessBoard[r + j * 2][c + k];
            this.chessBoard[r][c] = ' ';
            if (this.kingSafe()) {
              list = list + r + c + (r + j * 2) + (c + k) + oldPiece;
            }
            this.chessBoard[r][c] = 'K';
            this.chessBoard[r + j * 2][c + k] = oldPiece;
          }
        } catch (e) {}
      }
    }
    return list;
  }

  private posibleB(i: number): string {
    let list: string = '';
    let oldPiece: string = '';
    let r: number = Math.floor(i / 8);
    let c: number = i % 8;
    let temp: number = 1;
    for (let j: number = -1; j <= 1; j += 2) {
      for (let k: number = -1; k <= 1; k += 2) {
        try {
          while (' ' === this.chessBoard[r + temp * j][c + temp * k]) {
            oldPiece = this.chessBoard[r + temp * j][c + temp * k];
            this.chessBoard[r][c] = ' ';
            this.chessBoard[r + temp * j][c + temp * k] = 'B';
            if (this.kingSafe()) {
              list = list + r + c + (r + temp * j) + (c + temp * k) + oldPiece;
            }
            this.chessBoard[r][c] = 'B';
            this.chessBoard[r + temp * j][c + temp * k] = oldPiece;
            temp++;
          }
          if (this.esMinuscula(this.chessBoard[r + temp * j][c + temp * k])) {
            oldPiece = this.chessBoard[r + temp * j][c + temp * k];
            this.chessBoard[r][c] = ' ';
            this.chessBoard[r + temp * j][c + temp * k] = 'B';
            if (this.kingSafe()) {
              list = list + r + c + (r + temp * j) + (c + temp * k) + oldPiece;
            }
            this.chessBoard[r][c] = 'B';
            this.chessBoard[r + temp * j][c + temp * k] = oldPiece;
          }
        } catch (e) {}
        temp = 1;
      }
    }
    return list;
  }

  private posibleQ(i: number): string {
    let list: string = '';
    let oldPiece: string = '';
    let r: number = Math.floor(i / 8);
    let c: number = i % 8;
    let temp: number = 1;
    for (let j: number = -1; j <= 1; j++) {
      for (let k: number = -1; k <= 1; k++) {
        if (j !== 0 || k !== 0) {
          try {
            while (' ' === this.chessBoard[r + temp * j][c + temp * k]) {
              oldPiece = this.chessBoard[r + temp * j][c + temp * k];
              this.chessBoard[r][c] = ' ';
              this.chessBoard[r + temp * j][c + temp * k] = 'Q';
              if (this.kingSafe()) {
                list = list + r + c + (r + temp * j) + (c + temp * k) + oldPiece;
              }
              this.chessBoard[r][c] = 'Q';
              this.chessBoard[r + temp * j][c + temp * k] = oldPiece;
              temp++;
            }
            if (this.esMinuscula(this.chessBoard[r + temp * j][c + temp * k])) {
              oldPiece = this.chessBoard[r + temp * j][c + temp * k];
              this.chessBoard[r][c] = ' ';
              this.chessBoard[r + temp * j][c + temp * k] = 'Q';
              if (this.kingSafe()) {
                list = list + r + c + (r + temp * j) + (c + temp * k) + oldPiece;
              }
              this.chessBoard[r][c] = 'Q';
              this.chessBoard[r + temp * j][c + temp * k] = oldPiece;
            }
          } catch (e) {}
          temp = 1;
        }
      }
    }
    return list;
  }

  private posibleA(i: number): string {
    let list: string = '';
    let oldPiece: string = '';
    let r: number = Math.floor(i / 8);
    let c: number = i % 8;
    for (let j: number = 0; j < 9; j++) {
      if (j !== 4) {
        try {
          if (
            this.esMinuscula(this.chessBoard[r - 1 + Math.floor(j / 3)][c - 1 + (j % 3)]) ||
            ' ' === this.chessBoard[r - 1 + Math.floor(j / 3)][c - 1 + (j % 3)]
          ) {
            oldPiece = this.chessBoard[r - 1 + Math.floor(j / 3)][c - 1 + (j % 3)];
            this.chessBoard[r][c] = ' ';
            this.chessBoard[r - 1 + Math.floor(j / 3)][c - 1 + (j % 3)] = 'A';
            const kingTemp: number = this.kingPositionC;
            this.kingPositionC = i + Math.floor(j / 3) * 8 + (j % 3) - 9;
            if (this.kingSafe()) {
              list = list + r + c + (r - 1 + Math.floor(j / 3)) + (c - 1 + (j % 3)) + oldPiece;
            }
            this.chessBoard[r][c] = 'A';
            this.chessBoard[r - 1 + Math.floor(j / 3)][c - 1 + (j % 3)] = oldPiece;
            this.kingPositionC = kingTemp;
          }
        } catch (e) {}
      }
    }
    //need to add casting later
    return list;
  }

  private sortMoves(list: string): string {
    const score: number[] = new Array(Math.floor(list.length / 5));
    for (let i: number = 0; i < list.length; i += 5) {
      this.makeMove(list.substring(i, i + 5));
      score[i / 5] = -this.rating(-1, 0);
      this.undoMove(list.substring(i, i + 5));
    }
    let newListA: string = '';
    let newListB: string = list;
    for (let i: number = 0; i < Math.min(6, Math.floor(list.length / 5)); i++) {
      //first few moves only
      let max: number = -1000000;
      let maxLocation: number = 0;
      for (let j: number = 0; j < Math.floor(list.length / 5); j++) {
        if (score[j] > max) {
          max = score[j];
          maxLocation = j;
        }
      }
      score[maxLocation] = -1000000;
      newListA += list.substring(maxLocation * 5, maxLocation * 5 + 5);
      newListB = newListB.replace(list.substring(maxLocation * 5, maxLocation * 5 + 5), '');
    }
    return newListA + newListB;
  }

  private kingSafe(): boolean {
    //bishop/queen
    let temp: number = 1;
    for (let i: number = -1; i <= 1; i += 2) {
      for (let j: number = -1; j <= 1; j += 2) {
        try {
          while (
            ' ' ===
            this.chessBoard[Math.floor(this.kingPositionC / 8) + temp * i][(this.kingPositionC % 8) + temp * j]
          ) {
            temp++;
          }
          if (
            'b' ===
              this.chessBoard[Math.floor(this.kingPositionC / 8) + temp * i][
                (this.kingPositionC % 8) + temp * j
              ] ||
            'q' ===
              this.chessBoard[Math.floor(this.kingPositionC / 8) + temp * i][
                (this.kingPositionC % 8) + temp * j
              ]
          ) {
            return false;
          }
        } catch (e) {}
        temp = 1;
      }
    }
    //rook/queen
    for (let i: number = -1; i <= 1; i += 2) {
      try {
        while (
          ' ' === this.chessBoard[Math.floor(this.kingPositionC / 8)][(this.kingPositionC % 8) + temp * i]
        ) {
          temp++;
        }
        if (
          'r' === this.chessBoard[Math.floor(this.kingPositionC / 8)][(this.kingPositionC % 8) + temp * i] ||
          'q' === this.chessBoard[Math.floor(this.kingPositionC / 8)][(this.kingPositionC % 8) + temp * i]
        ) {
          return false;
        }
      } catch (e) {}
      temp = 1;
      try {
        while (' ' === this.chessBoard[Math.floor(this.kingPositionC / 8) + temp * i][this.kingPositionC % 8]) {
          temp++;
        }
        if (
          'r' === this.chessBoard[Math.floor(this.kingPositionC / 8) + temp * i][this.kingPositionC % 8] ||
          'q' === this.chessBoard[Math.floor(this.kingPositionC / 8) + temp * i][this.kingPositionC % 8]
        ) {
          return false;
        }
      } catch (e) {}
      temp = 1;
    }
    //knight
    for (let i: number = -1; i <= 1; i += 2) {
      for (let j: number = -1; j <= 1; j += 2) {
        try {
          if (
            'k' === this.chessBoard[Math.floor(this.kingPositionC / 8) + i][(this.kingPositionC % 8) + j * 2]
          ) {
            return false;
          }
        } catch (e) {}
        try {
          if (
            'k' === this.chessBoard[Math.floor(this.kingPositionC / 8) + i * 2][(this.kingPositionC % 8) + j]
          ) {
            return false;
          }
        } catch (e) {}
      }
    }
    //pawn
    if (this.kingPositionC >= 16) {
      try {
        if ('p' === this.chessBoard[Math.floor(this.kingPositionC / 8) - 1][(this.kingPositionC % 8) - 1]) {
          return false;
        }
      } catch (e) {}
      try {
        if ('p' === this.chessBoard[Math.floor(this.kingPositionC / 8) - 1][(this.kingPositionC % 8) + 1]) {
          return false;
        }
      } catch (e) {}
      //king
      for (let i: number = -1; i <= 1; i++) {
        for (let j: number = -1; j <= 1; j++) {
          if (i !== 0 || j !== 0) {
            try {
              if (
                'a' === this.chessBoard[Math.floor(this.kingPositionC / 8) + i][(this.kingPositionC % 8) + j]
              ) {
                return false;
              }
            } catch (e) {}
          }
        }
      }
    }
    return true;
  }

  private rating(list: number, depth: number): number {
    let counter: number = 0;
    let material: number = this.rateMaterial();
    counter += this.rateAttack();
    counter += material;
    counter += this.rateMoveablitly(list, depth, material);
    counter += this.ratePositional(material);
    this.flipBoard();
    material = this.rateMaterial();
    counter -= this.rateAttack();
    counter -= material;
    counter -= this.rateMoveablitly(list, depth, material);
    counter -= this.ratePositional(material);
    this.flipBoard();
    return -(counter + depth * 50);
  }

  private rateAttack(): number {
    let counter: number = 0;
    let tempPositionC: number = this.kingPositionC;
    for (let i: number = 0; i < 64; i++) {
      switch (this.chessBoard[Math.floor(i / 8)][i % 8]) {
        case 'P':
          {
            this.kingPositionC = i;
            if (!this.kingSafe()) {
              counter -= 64;
            }
          }
          break;
        case 'R':
          {
            this.kingPositionC = i;
            if (!this.kingSafe()) {
              counter -= 500;
            }
          }
          break;
        case 'K':
          {
            this.kingPositionC = i;
            if (!this.kingSafe()) {
              counter -= 300;
            }
          }
          break;
        case 'B':
          {
            this.kingPositionC = i;
            if (!this.kingSafe()) {
              counter -= 300;
            }
          }
          break;
        case 'Q':
          {
            this.kingPositionC = i;
            if (!this.kingSafe()) {
              counter -= 900;
            }
          }
          break;
      }
    }
    this.kingPositionC = tempPositionC;
    if (!this.kingSafe()) {
      counter -= 200;
    }
    return Math.floor(counter / 2);
  }

  private rateMaterial(): number {
    let counter: number = 0;
    let bishopCounter: number = 0;
    for (let i: number = 0; i < 64; i++) {
      switch (this.chessBoard[Math.floor(i / 8)][i % 8]) {
        case 'P':
          counter += 100;
          break;
        case 'R':
          counter += 500;
          break;
        case 'K':
          counter += 300;
          break;
        case 'B':
          bishopCounter += 1;
          break;
        case 'Q':
          counter += 900;
          break;
      }
    }
    if (bishopCounter >= 2) {
      counter += 300 * bishopCounter;
    } else {
      if (bishopCounter == 1) {
        counter += 250;
      }
    }
    return counter;
  }

  private rateMoveablitly(listLength: number, depth: number, _: number): number {
    let counter: number = 0;
    counter += listLength; //5 pointer per valid move
    if (listLength === 0) {
      //current side is in checkmate or stalemate
      if (!this.kingSafe()) {
        //if checkmate
        counter += -200000 * depth;
      } else {
        //if stalemate
        counter += -150000 * depth;
      }
    }
    return 0;
  }

  private ratePositional(material: number): number {
    let counter: number = 0;
    for (let i: number = 0; i < 64; i++) {
      switch (this.chessBoard[Math.floor(i / 8)][i % 8]) {
        case 'P':
          counter += pawnBoard[Math.floor(i / 8)][i % 8];
          break;
        case 'R':
          counter += rookBoard[Math.floor(i / 8)][i % 8];
          break;
        case 'K':
          counter += knightBoard[Math.floor(i / 8)][i % 8];
          break;
        case 'B':
          counter += bishopBoard[Math.floor(i / 8)][i % 8];
          break;
        case 'Q':
          counter += queenBoard[Math.floor(i / 8)][i % 8];
          break;
        case 'A':
          if (material >= 1750) {
            counter += kingMidBoard[Math.floor(i / 8)][i % 8];
            counter += this.posibleA(this.kingPositionC).length * 10;
          } else {
            counter += kingEndBoard[Math.floor(i / 8)][i % 8];
            counter += this.posibleA(this.kingPositionC).length * 30;
          }
          break;
      }
    }
    return counter;
  }

  private esMayuscula(value: string): boolean {
    const char = value.charAt(0);
    return char !== ' ' && char === char.toUpperCase();
  }

  private esMinuscula(value: string): boolean {
    const char = value.charAt(0);
    return char !== ' ' && char === char.toLowerCase();
  }

  private obtenerValorNumerico(value: string): number {
    // Number('z'.charCodeAt(0) - 'a'.charCodeAt(0) + 10)
    const char: string = value.charAt(0);
    if (isNaN(Number(char))) {
      if(char === '-' || char === ' ') return -1;
      return Number(char.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
    }
    return Number(char);
  }

  public printTablero(): void {
    let print : string = '';
    this.chessBoard.forEach(element => {
      
      element.forEach((e, idx) => {
        if(idx < 1){
          print += '[';
        }
        print += e;
        if(idx < 7) {
          print += ',';
        }
        else {
          print += ']\n';
        }
      })
    });
    console.log(print);
  }
}
