import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over-scene");
  }

  init(data) {
    this.score = data.score;
  }

  preload() {
    this.load.image("sky", "image/Tilesets/sky.png");
    this.load.image("replay", "image/replay.png");
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
    this.add.image(400, 300, "sky");
    const lostTextStyle = {
        fontSize: "60px",
        fontFamily: "Nova Square",
        color: "#ffffff",
        backgroundColor: '#00008B',
        align: "center",
        padding: {
          x: 20,
          y: 10,
        },
      };
  
      // Display the lose message
      const lostText = this.add
        .text(400, 200, "Game Over!!! You Lose!", lostTextStyle)
        .setOrigin(0.5);

    // Create the SCORE: text
    const scoreTextLabel = this.add.text(80, 300, "SCORE: ", {
        fontSize: "40px",
        fill: "#fff",
      });
      const scoreValueText = this.add.text(300, 300, this.score, {
        fontSize: "40px",
        fill: "#fff",
      });
  
      // Calculate the total width of both text elements
      const totalWidth = scoreTextLabel.width + scoreValueText.width;
      scoreTextLabel.x = this.game.config.width / 2 - totalWidth / 2;
      scoreValueText.x = scoreTextLabel.x + scoreTextLabel.width;
  
    const replayButton = this.add
      .image(400, 500, "replay")
      .setScale(2); // Set the scale as needed

    replayButton.setInteractive();

    replayButton.on("pointerdown", () => {
      this.scene.start("collecting-stars-scene");
    });
  }
}