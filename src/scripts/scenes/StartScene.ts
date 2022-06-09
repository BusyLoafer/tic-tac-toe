export class StartScene extends Phaser.Scene {

  constructor() {
    super('Start');
  }

  public preload(): void {
    this.load.image("cross", '/assets/sprites/cross.png')
    this.load.image("round", '/assets/sprites/round.png')
    this.load.image("pentagon", '/assets/sprites/pentagon.png')
    this.load.atlas('a-cross', '/assets/spritesheets/cross_sheet.png', '/assets/spritesheets/cross_sheet.json');
    this.load.atlas('a-round', '/assets/spritesheets/round_sheet.png', '/assets/spritesheets/round_sheet.json');
  }

  public create(): void {
    this.scene.start('background');
    this.scene.start('StartUI');
    this.game.events.on('playGame', ({chip, withFriend}) => this.play(chip, withFriend));
    this.game.events.on('gameRestart', () => this.gameRestart());
    this.game.events.on('gameWin', ({win}) => this.gameWin(win));
  }
  
  private play(chip: string, withFriend: boolean): void {
    this.scene.stop('StartUI');
    this.scene.start('Game', { withFriend: withFriend, chipType: chip });
  }
  
  private gameRestart(): void {
    this.scene.stop('WinUI');
    this.scene.get('Game').scene.restart();
  }
  
  private gameWin(win: boolean): void {
    this.scene.start('WinUI', { title: win ? "Победа!" : "Поражение" });
  }
}