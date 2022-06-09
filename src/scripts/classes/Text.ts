import { GameObjects, Scene } from 'phaser';
import { buttonSize } from '../../const';
export class Text extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, {
      // fontSize: 'calc(100vw / 25)',
      fontSize: '25px',
      // fontStyle: 'strong',
      color: '#FF4959',
      stroke: '#FF4959',
      strokeThickness: 1,
      // color: '#FFFFFF',
      // backgroundColor: "blue",
      fixedWidth: buttonSize.w,
      fixedHeight: buttonSize.h,
      align: "center"
    });
    // this.autoRound = true;
    // this.setPadding({y: (baseSize.height - 25 * 0.5})
    this.setPadding({y: (buttonSize.h - 25) * 0.5})
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }

  private create(): void {

  }
}