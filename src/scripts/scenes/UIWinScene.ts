import { baseSize, buttonSize as bS } from "../../const";
import { Chip } from "../classes/Chip";
import { Text } from "../classes/Text";

export class UIWinScene extends Phaser.Scene {
  private text!: Text;
  private title!: string;
  private graphics!: Phaser.GameObjects.Graphics;
  private container!: Phaser.GameObjects.Container;
  constructor() {
    super('WinUI');
  }

  public preload(): void {

  }

  public init(props): void {
    this.title = props.title
  }

  public create(): void {
    this.container = this.add.container(baseSize.width * 0.5, baseSize.height * 0.75)
    this.container.setAlpha(0)
    this.graphics = this.add.graphics();
    
    
    const winText = new Text(this, -bS.w * 0.5, -100, this.title).setColor('0xffffff').setFill('#ffffff')
    this.container.add(winText);

    this.addTextButton("Играть ещё", 0, () => {this.gameRestart()});
    
    this.tweens.add({
      targets: this.container,
      y: baseSize.height * 0.75,
      alpha: 1,
      duration: 200,
    })
  }

  private addTextButton(text: string, padding: number, func: Function): void {
    this.graphics.fillStyle(0xededed, 1);
    const x = -bS.w * 0.5
    const y = padding - bS.h * 0.5;
    this.container.add(this.graphics.fillRoundedRect(x, y, bS.w, bS.h, bS.r));
    const btnText = new Text(this, x, y, text)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', func);
    this.container.add(btnText);
  }

  private gameRestart(): void {
    const duration = 200;
    this.tweens.add({
      targets: this.container,
      y: baseSize.height,
      alpha: 0,
      duration: duration,
    })

    this.time.delayedCall(duration, () => {
      this.game.events.emit('gameRestart');
    }, [], this);
  }
}