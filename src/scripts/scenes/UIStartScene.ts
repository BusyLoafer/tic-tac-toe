import { baseSize, buttonSize as bS } from "../../const";
import { Chip } from "../classes/Chip";
import { Text } from "../classes/Text";

export class UIStartScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private buttonContainer!: Phaser.GameObjects.Container;
  private chipContainer!: Phaser.GameObjects.Container;
  private chips = {
    cross: null,
    round: null
  };
  private activeChip = "cross"
  constructor() {
    super('StartUI');
  }

  public preload(): void {

  }

  public create(): void {
    this.buttonContainer = this.add.container(baseSize.width * 0.5, baseSize.height * 0.75)
    this.chipContainer = this.add.container(baseSize.width * 0.5, baseSize.height * 0.4)
    this.graphics = this.add.graphics();
    this.addTextButton("Одиночная", - (bS.h + bS.padding) * 0.5, () => {this.play(false)});
    this.addTextButton("С другом", (bS.h + bS.padding) * 0.5, () => {this.play(true)});

    this.addChip('cross', -100, () => { this.changeActiveChip('cross') });
    this.addChip('round', 100, () => { this.changeActiveChip('round') });
  }

  private addTextButton(text: string, padding: number, func: Function): void {
    this.graphics.fillStyle(0xededed, 1);
    const x = -bS.w * 0.5
    const y = padding - bS.h * 0.5;
    this.buttonContainer.add(this.graphics.fillRoundedRect(x, y, bS.w, bS.h, bS.r));
    const btnText = new Text(this, x, y, text)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', func);
    this.buttonContainer.add(btnText);
  }

  private addChip(name: string, x: number, func: Function): void {
    const chip = new Chip(this, x, 0, name)
      .setInteractive({ useHandCursor: true })
      .setAlpha(name === this.activeChip ? 1 : 0.5)
      .setScale(3, 3)
      .on('pointerup', func);
    this.chips[name] = chip;
    this.chipContainer.add(chip);
  }

  private changeActiveChip(name: string) {
    let anotherChip = 'cross';
    if (name === 'cross') anotherChip = 'round'
    this.chips[name].setAlpha(1);
    this.chips[anotherChip].setAlpha(0.5);
    this.activeChip = name;
  }

  private play(withFriend: boolean): void {
    const duration = 500;
    this.tweens.add({
      targets: this.chipContainer,
      y: 0,
      alpha: 0,
      duration: duration,
    })
    this.tweens.add({
      targets: this.buttonContainer,
      y: baseSize.height,
      alpha: 0,
      duration: duration,
    })
    this.time.delayedCall(duration, () => {this.playGame(withFriend)}, [], this);
  }

  private playGame(withFriend: boolean): void {
    this.game.events.emit('playGame', { chip: this.activeChip, withFriend: withFriend });
  }
}