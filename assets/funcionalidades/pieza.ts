export enum TIPO_PIEZA {
  _VACIO_,
  NPEON,
  NTORRE,
  NCABALLO,
  NREINA,
  NREY,
  BPEON,
  BTORRE,
  BCABALLO,
  BREINA,
  BREY,
}

export default interface Pieza {
  tipoPieza: TIPO_PIEZA;

  puedeMoverse(): boolean;
  puedeMoverseHacia(): boolean;
}