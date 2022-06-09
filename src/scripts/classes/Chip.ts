import { Scene } from 'phaser';
import { chips } from '../../const';



export class Chip extends Phaser.GameObjects.Sprite {
  private chipId: number = -1;
  private chipKey: string = "";
  constructor(scene: Scene, x: number, y: number, texture: string, id?: number) {
    super(scene, x, y, texture, id)
    if (id !== undefined) this.chipId = id;
    this.chipKey = texture;
    // Добавление экземпляра текущего класса
    scene.add.existing(this);

    // создание анимации
    this.initAnimations();
  }

  public start(): void {
    this.anims.play(chips[this.chipKey].anim, true);
  }

  public getId(): number {
    return this.chipId
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: chips[this.chipKey].anim,
      frames: this.scene.anims.generateFrameNames(chips[this.chipKey].framePrefix, {
        prefix: 'bern-',
        end: 13,
      }),
      frameRate: 30,
    });
  }
}