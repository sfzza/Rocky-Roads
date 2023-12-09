import Phaser from "phaser";

export default class CollectingStarsScene extends Phaser.Scene {
  constructor() {
    super("collecting-stars-scene");
  }

  init() {
    this.platforms = undefined;
    this.player = undefined;
    this.stars = undefined;
    this.cursor = undefined;
    this.score = 0; 
    this.scoreText = undefined; 
    this.life = 3;
    this.lifeText = undefined;
  }

  preload() {
    this.load.image("ground", "image/Tilesets/platform.png");
    this.load.image("star", "image/Objects/coin_gold.png");
    this.load.image("tree", "image/Deco/tree_b.png");
    this.load.image("trunk", "image/Deco/tree_trunk.png");
    this.load.image("bomb", "image/bomb.png");
    this.load.image("sky", "image/Tilesets/sky.png");
    this.load.image("mountains", "image/Backgrounds/mountains_a.png");
    this.load.spritesheet("dude", "image/dude.png", {
      frameWidth: 20,
      frameHeight: 48,
    });
  }

  create() {
    // Set up background
    const sky = this.add.image(400, 300, "sky");

    const skyWidth = sky.width;
    const skyHeight = sky.height;

    const mountains = this.add.image(400, skyHeight, "mountains");

    const mountainScale = skyWidth / mountains.width;
    mountains.setScale(mountainScale);

    mountains.setOrigin(0.5, 1);
    mountains.y = sky.y + skyHeight / 2;

    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    const treePositions = [
			{ x: 720, y: 173, key: 'tree' },
			{ x: 500, y: 377, key: 'trunk' },
			{ x: 670, y: 353, key: 'tree' },
			{ x: 230, y: 203, key: 'tree' },
			{ x: 90, y: 203, key: 'tree' },
			{ x: 50, y: 503, key: 'tree' },
			{ x: 400, y: 503, key: 'tree' },
			// Add more tree positions as needed
		]

		this.createTrees(treePositions)

    // Create player
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);
    this.physics.add.collider(this.player, this.platforms);

    // Create stars
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 10,
      setXY: { x: 50, y: 0, stepX: 70 },
    });
    this.physics.add.collider(this.stars, this.platforms);

    // Give stars bounce
    this.stars.children.iterate(function (child) {
      child.setBounceY(0.5);
    });

    // Set up cursor keys for player movement
    this.cursor = this.input.keyboard.createCursorKeys();

    // Display the initial score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    // Display the initial life
    this.lifeText = this.add.text(16, 50, "Life: " + this.life, {
      fontSize: "32px",
      fill: "#fff",
    });

    // Set up collisions between player and platforms
    this.physics.add.collider(this.player, this.platforms);

    // Check for overlap between player and stars to collect stars
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    // Enemy
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);

    // Collision between player and bombs (enemy)
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    // Create bombs with movement
    this.createBombs(2);
  }

  update() {
    // Player movement logic
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    // Player jump logic
    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-300);
      this.player.anims.play("turn");
    }
  }

  createTrees(treePositions) {
		treePositions.forEach(({ x, y, key }) => {
			const tree = this.add.image(x, y, key)
			tree.setDepth(1) // Set the tree depth to be between platforms and other game elements
		})
	}

  createBombs(count) {
    for (let i = 0; i < count; i++) {
      let x = Phaser.Math.Between(100, 700);
      const bomb = this.bombs.create(x, 16, "bomb"); // Create bomb as the enemy
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);

      // Assign different initial velocities based on the bomb index
      if (i === 0) {
        // First bomb falls from left to right
        bomb.setVelocity(Phaser.Math.Between(50, 200), 20);
      } else {
        // Second bomb falls from right to left
        x = Phaser.Math.Between(100, 700);
        bomb.setX(x);
        bomb.setVelocity(Phaser.Math.Between(-200, -50), 20);
      }
    }
  }

  hitBomb(player, bomb) {
    player.setX(100); // Move the player to the initial position
    player.setY(450);
    this.updateLife(); // Reduce life by 1
  }

  collectStar(player, star) {
    // Destroy collected stars
    star.destroy();

    this.score += 10; // You can adjust the score increment as needed
    this.updateScoreText(); // Update the displayed score
  }

  updateScoreText() {
    // Update the displayed score text
    this.scoreText.setText("Score: " + this.score);
    if (this.score >= 110) {
			// Transition to the win scene when the score reaches 110
			this.scene.start('win-scene', { score: this.score});
		}
  }

  updateLife() {
    this.life--;
    this.updateLifeText(); // Update the displayed life
    if (this.life <= 0) {
      this.scene.start('game-over-scene', { score: this.score}); // Go to the game over scene when life reaches zero
    }
  }

  updateLifeText() {
    this.lifeText.setText("Life: " + this.life);
  }
}
