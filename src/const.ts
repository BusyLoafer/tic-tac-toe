export const DEBUG = false;

export const baseSize = {
  width: 600,
  height: 700,
}

export const buttonSize = {
  w: 300,
  h: 80,
  padding: 10,
  r: 8
}

export const jSize: number = 100;
export const lSize: number = 10;

export const maskScaleSpeed = 5;

export const directions = [
  {dx: -1, dy: 1},    // /
  {dx: -1, dy: 0},    // -
  {dx: -1, dy: -1},   // \
  {dx: 0, dy: -1}     // |
]

export const chips = {
  cross: {
    anim: 'bern_cross',
    framePrefix: "a-cross"
  },
  round: {
    anim: 'bern_round',
    framePrefix: "a-round"
  }
}

export const winAnim = {
  x: 0,
  y: 0,
  scale: 2,
  duration: 1000,
  delay: 1000,
  alpha: 1
}

export const fragment5X = {
  "xxxxx": 9999,
  "xxxx_": 5000,
  "_xxxx": 5000,
  "x_xxx": 5000,
  "xx_xx": 5000,
  "xxx_x": 5000,
  "xxx__": 120,
  "_xxx_": 200,
  "__xxx": 120,
  "x_xx_": 120,
  "_x_xx": 120,
  "xx_x_": 120,
  "_xx_x": 120,
  "x_x_x": 120,
  "xx__x": 120,
  "x__xx": 120,
  "xx___": 80,
  "_xx__": 80,
  "__xx_": 80,
  "___xx": 80,
  "x_x__": 80,
  "_x_x_": 80,
  "__x_x": 80,
  "x__x_": 50,
  "_x__x": 50,
  "x___x": 50,
}

export const fragment4X = {
  "_xxx": 80,
  "x_xx": 80,
  "xx_x": 80,
  "xxx_": 80,
  "xx__": 50,
  "_xx_": 50,
  "__xx": 50,
  "x_x_": 50,
  "_x_x": 50,
  "x__x": 50,
  "x___": 20,
  "_x__": 20,
  "__x_": 20,
  "___x": 20,
}
export const fragment3X = {
  "xx_": 30,
  "_xx": 30,
  "x_x": 30,
  "x__": 10,
  "_x_": 10,
  "__x": 10
}

export const fragment5O = {
  "ooooo": 9999,
  "oooo_": 5000,
  "_oooo": 5000,
  "o_ooo": 5000,
  "oo_oo": 5000,
  "ooo_o": 5000,
  "ooo__": 120,
  "_ooo_": 200,
  "__ooo": 120,
  "o_oo_": 120,
  "_o_oo": 120,
  "oo_o_": 120,
  "_oo_o": 120,
  "o_o_o": 120,
  "oo__o": 120,
  "o__oo": 120,
  "oo___": 80,
  "_oo__": 80,
  "__oo_": 80,
  "___oo": 80,
  "o_o__": 80,
  "_o_o_": 80,
  "__o_o": 80,
  "o__o_": 50,
  "_o__o": 50,
  "o___o": 50,
}

export const fragment4O = {
  "_ooo": 80,
  "o_oo": 80,
  "oo_o": 80,
  "ooo_": 80,
  "oo__": 50,
  "_oo_": 50,
  "__oo": 50,
  "o_o_": 50,
  "_o_o": 50,
  "o__o": 50,
  "o___": 20,
  "_o__": 20,
  "__o_": 20,
  "___o": 20,
}
export const fragment3O = {
  "oo_": 30,
  "_oo": 30,
  "o_o": 30,
  "o__": 10,
  "_o_": 10,
  "__o": 10
}