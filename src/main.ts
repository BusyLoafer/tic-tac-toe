import Phaser from 'phaser'
import { baseSize } from './const'
import { BackgroundScene } from './scripts/scenes/BackgroundScene'
import { GameScene } from './scripts/scenes/GameScene'
import { StartScene } from './scripts/scenes/StartScene'
import { UIStartScene } from './scripts/scenes/UIStartScene'
import { UIWinScene } from './scripts/scenes/UIWinScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "tic-tac-toe",
  width: baseSize.width,
  height: baseSize.height,
  backgroundColor: "#FFFFFF",
  scene: [StartScene, BackgroundScene, GameScene, UIStartScene, UIWinScene]
}
const game = new Phaser.Game(gameConfig)

export default game;
