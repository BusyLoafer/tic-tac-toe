import { baseSize, fragment3X, fragment4X, fragment5X, fragment3O, fragment4O, fragment5O, directions, winAnim, jSize, lSize, maskScaleSpeed, } from "../../const";
import { Chip } from "../classes/Chip";
import { addCells, Cell, defaultCells, getPointPoses, logTableIds, logTableWeights, Point, Status, Step } from "../other/utils";


export class GameScene extends Phaser.Scene {

  private graphics!: Phaser.GameObjects.Graphics;
  private dimension!: number;
  private maskShape!: Phaser.GameObjects.Graphics;
  private maskRadius = 1;
  private graphicScale!: number;

  private iconCount!: number;
  private iconCountCheck!: number;

  private lineContainer!: Phaser.GameObjects.Container;
  private shapeContainer!: Phaser.GameObjects.Container;

  private pointPoses!: Point[][];
  private padding!: Point;

  private currentPoint!: Point;

  private currentStep!: Step;

  private cells!: Cell[][];
  private chips!: Chip[];

  private playerChipType!: Step;

  private computer!: boolean;

  private win = false;

  constructor() {
    super("Game");
  }

  public preload(): void { }

  public init({ withFriend, chipType }): void {
    this.computer = !withFriend;
    this.playerChipType = chipType === 'cross' ? Step.Cross : Step.Round;
    this.currentStep = this.playerChipType;
  }

  public create(): void {

    this.setDefaultSettings();

    this.lineContainer = this.add.container(baseSize.width * 0.5, baseSize.height * 0.5)
    this.shapeContainer = this.add.container(baseSize.width * 0.5, baseSize.height * 0.5)

    this.graphics = this.add.graphics();

    this.maskShape = this.make.graphics({});
    this.maskShape.fillStyle(0xffffff);
    this.maskShape.beginPath();
    this.fillMask();

    const mask = this.maskShape.createGeometryMask();

    this.graphics.setMask(mask)

    this.drawLines()


    this.input.on('pointerup', (pointer: PointerEvent) => {
      if (!this.computer || this.currentStep === this.playerChipType) {
        this.checkAndDrawIcon(pointer);
      }
    });

    this.pointPoses = getPointPoses(this.dimension);
    this.cells = defaultCells(this.dimension);
  }

  public update(): void {
    if (this.maskRadius < jSize * 5 + lSize * 4) {
      this.maskRadius += maskScaleSpeed;
      if (this.maskRadius > jSize * 5 + lSize * 4) {
        this.maskRadius = jSize * 5 + lSize * 4
      }
      this.fillMask();
    }
  }

  private setDefaultSettings(): void {
    this.dimension = 5;
    this.padding = {
      x: (baseSize.width - (jSize * this.dimension + lSize * (this.dimension - 1))) / 2,
      y: (baseSize.height - (jSize * this.dimension + lSize * (this.dimension - 1))) / 2,
    };
    this.win = false;
    this.iconCount = 0;
    this.iconCountCheck = Math.round(this.dimension * this.dimension * 0.7);
    this.chips = [];
    this.graphicScale = 1;
  }

  private increase(): void {
    const oldSize = jSize * 5 + lSize * 4
    this.dimension += 2;
    const newSize = jSize * this.dimension + lSize * (this.dimension - 1)
    this.drawLines();
    this.pointPoses = getPointPoses(this.dimension);
    this.cells = addCells(this.cells, this.dimension)
    this.calculateNewCellsWeight();
    this.calculateWeights();
    this.graphicScale = oldSize / newSize;
    this.tweens.add({
      targets: [this.lineContainer, this.shapeContainer],
      scaleX: { value: this.graphicScale },
      scaleY: { value: this.graphicScale },
      duration: 1000
    });
  }

  private checkAndDrawIcon(pointer: PointerEvent): void {
    if (!this.win) {
      const posIndex = this.calculatePosition(pointer);
      if (this.checkEmptyPoint(posIndex)) {
        this.calculateAndDraw(posIndex)
      }
    }
  }

  private calculateAndDraw(posIndex: Point): void {
    this.currentPoint = posIndex;
    this.drawIcon(this.pointPoses[posIndex.y][posIndex.x]);
    this.fillCell(posIndex)
  }

  private calculatePosition(pos: PointerEvent | Point): Point {
    const xIndex = Math.floor((pos.x - this.padding.x) / ((jSize + lSize) * this.graphicScale))
    const yIndex = Math.floor((pos.y - this.padding.y) / ((jSize + lSize) * this.graphicScale))
    return { x: xIndex, y: yIndex }
  }

  private drawIcon(point: Point) {
    const cross = this.currentStep === Step.Cross;
    const icon = new Chip(this, point.x, point.y, cross ? 'cross' : 'round', this.iconCount)
    icon.start();
    this.chips.push(icon)
    this.shapeContainer.add(icon)
  }

  private drawLines(): void {
    this.graphics.lineStyle(lSize, 0x8a243c, 1);
    const offset = (jSize * this.dimension + lSize * (this.dimension - 1)) * 0.5

    for (let i = 0; i < this.dimension - 1; i++) {
      const x = jSize * (i + 1) + lSize * (i + 0.5) - offset;
      var line = new Phaser.Geom.Line(x, -offset, x, offset);
      this.lineContainer.add(this.graphics.strokeLineShape(line));
    }

    for (let i = 0; i < this.dimension - 1; i++) {
      const y = jSize * (i + 1) + lSize * (i + 0.5) - offset;
      var line = new Phaser.Geom.Line(-offset, y, offset, y);
      this.lineContainer.add(this.graphics.strokeLineShape(line));
    }
  }

  private fillMask(): void {
    this.maskShape.fillRect(
      (baseSize.width - this.maskRadius) * 0.5,
      (baseSize.height - this.maskRadius) * 0.5,
      this.maskRadius, this.maskRadius);
  }

  private checkEmptyPoint(pos: Point): boolean {
    return this.cells[pos.y][pos.x].value === 0
  }

  private fillCell(p: Point): void {
    const cross = this.currentStep === Step.Cross
    this.currentStep = cross ? Step.Round : Step.Cross;
    this.cells[p.y][p.x] = {
      id: this.iconCount,
      value: cross ? 1 : -1,
      text: cross ? "x" : "o",
      weight: 0,
      state: Status.Close
    }

    this.iconCount++;
    if (this.iconCount >= this.iconCountCheck) {
      this.increase();
      this.iconCountCheck = Math.round(this.dimension * this.dimension * 0.7)
    } else {
      this.calculateWeights();
    }
  }

  private calculateWeights(): void {
    const points = this.getCheckAllPoints(this.currentPoint);
    points.forEach(arrPoint => {
      this.calculateWeightPoints(arrPoint)
    });

    logTableWeights(this.cells)

    if (this.computer && this.playerChipType !== this.currentStep) {
      this.getMaxWeight()
    }
  }

  private getCheckAllPoints(p: Point): Point[][] {
    const points: Point[][] = []
    directions.forEach(dir => {
      points.push(this.getCheckPoints(p, dir.dx, dir.dy))
    });
    return points
  }

  private getCheckPoints(p: Point, dx: number, dy: number): Point[] {
    const points: Point[] = [];
    for (let i = 4; i >= -4; i--) {
      const tempX = p.x + dx * i;
      const tempY = p.y + dy * i;
      if (tempX >= 0 && tempY >= 0 &&
        tempX < this.dimension && tempY < this.dimension) {
        points.push({ x: tempX, y: tempY })
      }
    }
    return points
  }

  private calculateWeightPoints(points: Point[]): void {
    points.forEach(p => {
      if (this.cells[p.y] && this.cells[p.y][p.x]
        // && this.cells[p.y][p.x].state === Status.Open
      ) {
        this.cells[p.y][p.x].weight = 0
        directions.forEach(dir => {
          this.cells[p.y][p.x].weight += this.calculateWeight(p, dir.dx, dir.dy);
        });

        if (this.cells[p.y][p.x].state === Status.Close) {
          this.cells[p.y][p.x].weight = 0
        }
      }
    });
  }

  private calculateNewCellsWeight(): void {
    const points: Point[] = [];
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        if (i === 0 || j === 0 || i === this.dimension - 1 || j === this.dimension - 1) {
          points.push({ x: j, y: i });
        }
      }
    }
    this.calculateWeightPoints(points);
  }

  private calculateWeight(p: Point, dx: number, dy: number): number {
    let w = 0;
    let str = "";
    let winIds: number[] = []
    for (let i = -4; i < 5; i++) {
      const tempX = p.x + dx * i
      const tempY = p.y + dy * i
      if (this.cells[tempY] && this.cells[tempY][tempX]) {
        str += this.cells[tempY][tempX].text;
        winIds.push(this.cells[tempY][tempX].id || 0)
      } else {
        str += "_"
        winIds.push(-1)
      }
    }

    this.checkWin(str, winIds);

    const minStr = str.slice(2, 7)
    const midStr = str.slice(1, 8)
    for (const key in fragment3X) {
      if (minStr.includes(key)) w += fragment3X[key]
    }
    for (const key in fragment4X) {
      if (midStr.includes(key)) w += fragment4X[key]
    }
    for (const key in fragment5X) {
      if (str.includes(key)) w += fragment5X[key]
    }

    for (const key in fragment3O) {
      if (minStr.includes(key)) w += fragment3O[key]
    }
    for (const key in fragment4O) {
      if (midStr.includes(key)) w += fragment4O[key]
    }
    for (const key in fragment5O) {
      if (str.includes(key)) w += fragment5O[key]
    }

    return w
  }

  private getMaxWeight(): void {
    let max: number = -1;
    let maxPoints: Point[] = [];

    this.cells.forEach((line, i) => {
      line.forEach(({ state, weight }, j) => {
        if (state === Status.Open) {
          if (weight > max) {
            max = weight;
            maxPoints = [{ x: j, y: i }]
          } else if (weight === max) {
            maxPoints.push({ x: j, y: i })
          }
        }
      })
    });

    if (maxPoints.length && !this.win) {
      let index = 0
      if (maxPoints.length > 1) {
        index = Math.floor(Math.random() * maxPoints.length)
      }
      setTimeout(() => {
        this.calculateAndDraw(maxPoints[index])
      }, Phaser.Math.Between(500, 1000));
    }

  }

  private checkWin(str: string, winIds: number[]): void {
    let index = str.indexOf('xxxxx');
    if (index < 0) index = str.indexOf('ooooo');
    if (index >= 0 && !this.win) {
      winIds = winIds.splice(index, 5)
      const winChips = winIds.map(id => {
        const chip = this.chips.find(chip => id === chip.getId())
        return chip || { x: 0, y: 0 }
      })
      this.win = true;
      this.graphics.lineStyle(10, 0xFFFFFF, 1);
      logTableIds(this.cells)
      const line = new Phaser.Geom.Line(winChips[0].x, winChips[0].y, winChips[4].x || 0, winChips[4].y || 0);

      this.lineContainer.add(this.graphics.strokeLineShape(line));
      const loseChips = this.chips.filter(c => !winIds.includes(c.getId()))
      this.graphics.setAlpha(1)
      const win = !this.computer || this.currentStep !== this.playerChipType
      this.tweens.add({
        targets: this.graphics,
        alpha: 0.2,
        duration: winAnim.duration,
        delay: winAnim.delay
      })
      this.tweens.add({
        targets: winChips,
        x: { value: winAnim.x },
        y: { value: winAnim.y },
        scaleX: { value: winAnim.scale },
        scaleY: { value: winAnim.scale },
        alpha: { value: winAnim.alpha },
        duration: winAnim.duration,
        delay: winAnim.delay
      });
      this.tweens.add({
        targets: loseChips,
        alpha: { value: 0.1, duration: 1000 }
      });

      this.time.delayedCall(winAnim.duration + winAnim.delay, () => {
        this.game.events.emit('gameWin', { win: win });
      }, [], this);
    }
  }
}