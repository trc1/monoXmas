import { makeAutoObservable } from "mobx";
import playerStore from "./playerStore";

class GameStore {
  playerPosition = 0;  // Logical position of the player's starting platform
  stickLength = 0;     // Length of the stick being grown
  stickAngle = 0;      // Angle of the stick during the fall
  isPlayerFalling = false; // Whether the player is falling
  targetDistance = Math.max(Math.random() * 150 + 50, 400); // Minimum target distance of 150px
  isStickPlaced = false;  // Whether the stick is placed
  isStickFalling = false; // Whether the stick is falling
  isGameOver = false;     // Whether the game is over
  score = 0;              // Player's score
  growInterval = null;    // Interval ID for growing the stick
  pastPlatforms = [
    { position: 0, randomOffset: 0, randomRoofWidth: 150 }, // Initial platform with default values
  ];
  speedMultiplier = 1; // Speed multiplier that increases after each score
  timeElapsed = 0;     // Timer to track time elapsed in seconds
  timerInterval = null;
  showGame = false;

  // Future platform properties
  futurePlatform = {
    position: 0,
    randomOffset: 0,
    randomRoofWidth: 0,
  };

  constructor() {
    makeAutoObservable(this);
    this.startTimer();
    this.generateFuturePlatform(); // Generate the initial future platform
  }

  startGame() {
    this.showGame = true;
  }

  // Increment stick length while the player is holding the mouse down
  growStick() {
    if (!this.isStickPlaced) {
      this.stickLength +=2 * this.speedMultiplier; // Adjust speed based on multiplier
    }
  }

  // Start the stick's falling animation
  startStickFall() {
    this.isStickPlaced = true;
    this.isStickFalling = true;

    const fallInterval = setInterval(() => {
      if (this.stickAngle < 90) {
        this.stickAngle += 2; // Stick fall speed
      } else {
        clearInterval(fallInterval);
        this.isStickFalling = false;
        this.movePlayerAcrossStick();
      }
    }, 8);
  }

  // Modify movePlayerAcrossStick to control speed
  async movePlayerAcrossStick() {
    const stickEnd = this.playerPosition + 50 + this.stickLength;
    const targetX = stickEnd;

    // Pass a speed value to make the player move faster
    await playerStore.movePlayer(targetX, 10);  // Set speed to 10 or any desired value
    this.checkSuccessOrFall();
  }

  // Check if the stick correctly landed on the target platform
  async checkSuccessOrFall() {
    const stickEnd = this.playerPosition + 70 + this.stickLength;

    if (
      stickEnd >= this.playerPosition + this.targetDistance &&
      stickEnd <= this.playerPosition + this.targetDistance + 70
    ) {
      // Success
      this.score++;
      this.speedMultiplier += 0.3; // Increase speed multiplier
      this.playerPosition += this.targetDistance;

      // Add the current target platform to past platforms
      this.pastPlatforms.push({
        position: this.playerPosition,
        randomOffset: this.futurePlatform.randomOffset,
        randomRoofWidth: this.futurePlatform.randomRoofWidth,
      });

      // Update the target distance to the future platform
      this.targetDistance = this.futurePlatform.position - this.playerPosition;

      // Generate the next future platform
      this.generateFuturePlatform();

      this.resetStick();
    } else {
      // Failure: Player falls
      this.isPlayerFalling = true;
      await playerStore.fallPlayer();
      this.isGameOver = true;
      this.isPlayerFalling = false;
    }
  }

  // Reset stick and prepare for the next platform
  resetStick() {
    this.stickLength = 0;
    this.stickAngle = 0;
    this.isStickPlaced = false;
    playerStore.resetPlayerPosition(this.playerPosition + 25, 440);
  }

  // Generate a new future platform
  generateFuturePlatform() {
    const randomOffset = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    const randomRoofWidth = Math.floor(Math.random() * (300 - 100 + 1)) + 200;

    // Calculate the position of the future platform
    const futurePosition =
      this.playerPosition + this.targetDistance + Math.max(Math.random() * 150 + 50, 400);

    this.futurePlatform = {
      position: futurePosition,
      randomOffset,
      randomRoofWidth,
    };
  }

  // Restart the game
  restartGame() {
    this.playerPosition = 0;
    this.stickLength = 0;
    this.stickAngle = 0;
    this.isStickPlaced = false;
    this.isStickFalling = false;
    this.isPlayerFalling = false;
    this.isGameOver = false;
    this.score = 0;
    this.targetDistance = Math.max(Math.random() * 150 + 50, 400); // Minimum target distance
    this.pastPlatforms = [
      { position: 0, randomOffset: 0, randomRoofWidth: 150 }, // Initial platform with default values
    ];
    this.speedMultiplier = 1; // Reset speed multiplier
    this.timeElapsed = 0; // Reset timer
    playerStore.resetPlayerPosition(25, 440); // Reset player position

    // Generate the first future platform
    this.generateFuturePlatform();
  }

  // Start the timer for tracking elapsed time
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isGameOver) {
        this.timeElapsed += 1; // Increment time by 1 second
      }
    }, 1000); // Update every second
  }

  // Format the timer (HH:MM:SS)
  getFormattedTime() {
    const hours = String(Math.floor(this.timeElapsed / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((this.timeElapsed % 3600) / 60)).padStart(2, "0");
    const seconds = String(this.timeElapsed % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}

export default new GameStore();

