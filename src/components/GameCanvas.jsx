import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import gameStore from "../store/gameStore";
import playerStore from "../store/playerStore";

const GameCanvas = observer(() => {
    const canvasRef = useRef(null);
    let animationId = null;

    console.log(gameStore.targetDistance, "target");
    console.log(gameStore.stickLength, "stick");

    const drawGame = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const chimneyImg = new Image();
        const roofImg = new Image();
        const bgImg = new Image();

        chimneyImg.src = "/chimney.svg";
        roofImg.src = "/roof.svg"; 
        bgImg.src = "/bg.svg"; 

        const roofWidth = 380;
        const roofHeight = 150;

        const chimneyWidth = 70;
        const chimneyHeight = 70;

        const bgWidth = canvas.width - 300;
        const bgHeight = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const offsetX = 200 - playerStore.playerX;

        // Draw background
        ctx.drawImage(bgImg, 150, 70, bgWidth, bgHeight);

        // Draw current and target roofs
        ctx.drawImage(
            roofImg,
            gameStore.playerPosition + offsetX - 50 - 50,
            460,
            roofWidth,
            roofHeight
        ); // Current roof
        ctx.drawImage(
            roofImg,
            gameStore.playerPosition + gameStore.targetDistance + offsetX - 50,
            460,
            roofWidth,
            roofHeight
        ); // Target roof

        // Draw the chimneys above the current and target roofs
        ctx.drawImage(
            chimneyImg,
            gameStore.playerPosition + offsetX,
            500 - chimneyHeight,
            chimneyWidth,
            chimneyHeight
        );
        ctx.drawImage(
            chimneyImg,
            gameStore.playerPosition + gameStore.targetDistance + offsetX,
            500 - chimneyHeight,
            chimneyWidth,
            chimneyHeight
        );

        // Draw future roof
        ctx.drawImage(
            roofImg,
            gameStore.futurePlatform.position + offsetX - 50,
            460,
            roofWidth,
            roofHeight
        );

        // Draw chimney
        ctx.drawImage(
            chimneyImg,
            gameStore.futurePlatform.position + offsetX,
            500 - chimneyHeight,
            chimneyWidth,
            chimneyHeight
        );

        // Draw current stick
        if (gameStore.isStickPlaced) {
            ctx.save();
            ctx.translate(gameStore.playerPosition + 70 + offsetX, 440);
            ctx.rotate((gameStore.stickAngle * Math.PI) / 180);

            // Draw candy cane stripes
            const stickWidth = 5;
            const stickHeight = gameStore.stickLength;
            for (let i = 0; i < stickHeight; i += 10) {
                ctx.fillStyle = i % 20 === 0 ? "red" : "white";
                ctx.fillRect(0, -i - 10, stickWidth, 10);
            }
            ctx.restore();
        } else {
            const stickWidth = 5;
            const stickHeight = gameStore.stickLength;
            for (let i = 0; i < stickHeight; i += 10) {
                ctx.fillStyle = i % 20 === 0 ? "red" : "white";
                ctx.fillRect(
                    gameStore.playerPosition + 70 + offsetX,
                    440 - i - 10,
                    stickWidth,
                    10
                );
            }
        }

        // Draw player
        const currentPlayerImage =
            playerStore.playerVelocity !== 0
                ? playerStore.playerWalkingImage
                : playerStore.playerImage;

        if (currentPlayerImage) {
            const playerWidth = 80;
            const playerHeight = 80;
            const playerYPosition = playerStore.playerY - playerHeight;

            ctx.drawImage(
                currentPlayerImage,
                200 - playerWidth / 2,
                playerYPosition,
                playerWidth,
                playerHeight
            );
        }

        // Display score
        ctx.fillStyle = "white";
        ctx.font = `20px Roboto`;
        ctx.fillText(`Score: ${gameStore.score}`, 10, 30);

        if (gameStore.isGameOver) {
            ctx.fillStyle = "white";
            ctx.font = `40px Roboto`;
            ctx.fillText("Game Over!", 400, 200);
            cancelAnimationFrame(animationId);
            return;
        }

        animationId = requestAnimationFrame(drawGame);
    };

    const handleRestart = () => {
        gameStore.restartGame();
        playerStore.resetPlayerPosition(25, 440); // Reset player position
        if (!animationId) {
            drawGame();
        }
    };

    const handleMouseDown = () => {
        if (!gameStore.isGameOver && !gameStore.isStickPlaced) {
            gameStore.growInterval = setInterval(() => {
                gameStore.growStick();
            }, 8);
        }
    };

    const handleMouseUp = () => {
        clearInterval(gameStore.growInterval);
        gameStore.startStickFall();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 576;

        drawGame();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <React.Fragment>
            <div className="game">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                />
            </div>
            {gameStore.isGameOver && (
                <button onClick={handleRestart}>Restart Game</button>
            )}
        </React.Fragment>
    );
});

export default GameCanvas;