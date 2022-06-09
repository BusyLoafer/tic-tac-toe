import { baseSize } from "../../const";

type PentagonType = {
  image: Phaser.GameObjects.Image,
  speed: number
}

export class BackgroundScene extends Phaser.Scene {

  private shapes: PentagonType[] = [];

  constructor() {
    super('background');
  }

  public preload(): void {
    //
  }

  public create(): void {
    var graphics = this.add.graphics();
    graphics.fillGradientStyle(0xf02d5b, 0xFF4959, 0xE01463, 0xf02d5b, 1);
    graphics.fillRect(0, 0, baseSize.width, baseSize.height);

    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(-10 + 100 * i, 100 * (i + 1));
      const y = Phaser.Math.Between(10, baseSize.height);
      const scale = Math.random() * (1 - 0.5 + 1) + 0.5
      const speed = Math.random() * (0.4 - 0.2 + 1) + 0.2

      const image = this.add.image(x, y, "pentagon")

      image.setAlpha(0.5)
      image.setScale(scale, scale)

      this.shapes.push({ image: image, speed: speed })

    }
  }

  public update(time: number, delta: number): void {
    for (let i = 0; i < this.shapes.length; i++) {
      const element = this.shapes[i];
      let posY: number = element.image.y - element.speed;
      if (posY < -50) posY = baseSize.height + 50
      element.image.setPosition(element.image.x, posY)
      element.image.setRotation(element.image.rotation + 0.005)
    }
  }
}