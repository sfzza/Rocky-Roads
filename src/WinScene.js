import Phaser from "phaser";

export default class WinScene extends Phaser.Scene {
  constructor() {
    super("win-scene");
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

    const winTextStyle = {
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

    // Display the win message
    const winText = this.add
      .text(400, 200, "Congratulations! You won!", winTextStyle)
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

    const replayButton = this.add.image(400, 400, "replay").setScale(0.5); // Set the scale as needed

    replayButton.setInteractive();

    replayButton.on("pointerdown", () => {
      this.scene.start("collecting-stars-scene");
    });
  }
}
