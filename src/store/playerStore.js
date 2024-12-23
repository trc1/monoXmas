import { makeAutoObservable } from "mobx";

class PlayerStore {
  playerX = 25;        // Logical X position of the player
  playerY = 440;       // Logical Y position of the player
  playerVelocity = 0;  // Player's velocity (both X and Y)
  playerImage = new Image();  // Store the player's current image
  playerWalkingImage = new Image(); // Store the player's walking image

  constructor() {
    makeAutoObservable(this);
    this.playerImage.src = "./Santa.svg"; // Directly set the idle image
    this.playerWalkingImage.src = "./Santa.svg"; // Directly set the walking image
  }

  // Update player image based on movement (walking or idle)
  updatePlayerImage(isWalking) {
    this.playerImage = isWalking ? this.playerWalkingImage : new Image();
    if (!isWalking) {
      this.playerImage.src = "./Santa.svg"; // Reset to idle image
    }
  }

  // Reset player position and velocity
  resetPlayerPosition(initialX, initialY) {
    this.playerX = initialX;
    this.playerY = initialY;
    this.playerVelocity = 0; // Reset velocity
  }

  // Simulate the player's fall
  fallPlayer() {
    return new Promise((resolve) => {
      const fallInterval = setInterval(() => {
        if (this.playerY < 700) { // Simulate falling
          this.playerY += 8; // Player fall speed
        } else {
          clearInterval(fallInterval);
          resolve(); // Resolve once the fall is complete
        }
      }, 16);
    });
  }

  // Move player horizontally
  movePlayer(targetX) {
    return new Promise((resolve) => {
      this.playerVelocity = 8; // Set movement speed
      const moveInterval = setInterval(() => {
        if (this.playerX < targetX) {
          this.playerX += this.playerVelocity; // Update position
          this.updatePlayerImage(true); // Use walking image
        } else {
          clearInterval(moveInterval);
          this.playerVelocity = 0; // Stop movement
          this.updatePlayerImage(false); // Reset to idle image
          resolve(); // Resolve when movement is complete
        }
      }, 16);
    });
  }
}

export default new PlayerStore();
