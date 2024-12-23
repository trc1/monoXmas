import React, { useEffect, useRef } from "react";
import { ReactTyped } from "react-typed";
import { observer } from "mobx-react-lite";
import html2canvas from "html2canvas";
import gameStore from "../store/gameStore";
import playerStore from "../store/playerStore";
import Logo from "./Logo";

const GameCanvas = observer(() => {
    const canvasRef = useRef(null);
    let animationId = null;

    const chimneyImg = new Image();
    const roofImg = new Image();
    const bgImg = new Image();
    const logoImg = new Image();

    chimneyImg.src = "/chimney.svg";
    roofImg.src = "/roof.svg";
    bgImg.src = "/bg.svg";
    logoImg.src = "logo-hat.svg";

    const drawGame = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const roofWidth = 380;
        const roofHeight = 120;

        const chimneyWidth = 70;
        const chimneyHeight = 70;

        const bgWidth = canvas.width - 300;
        const bgHeight = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const offsetX = 200 - playerStore.playerX;

        ctx.fillStyle = "#1b2c37"; // Set the background color (same as body background)
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
        ctx.font = `40px Roboto`;
        ctx.textAlign = "center";
        ctx.fillText(`Score: ${gameStore.score}`, canvas.width / 2, 70);

        if (gameStore.isGameOver) {
            ctx.fillStyle = "white";
            ctx.font = `80px Roboto`;
            ctx.textAlign = "center";
            ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
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

    const downloadScreenshot = () => {
        const canvas = canvasRef.current;

        html2canvas(canvas, {
            backgroundColor: "#1b2c37"
        }).then((canvasScreenshot) => {
            const screenshot = canvasScreenshot.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = screenshot;
            link.download = "mono_screenshot.png";
            link.click();
        });
    };

    const handleTouchStart = (event) => {
        event.preventDefault();
        handleMouseDown();
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
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleMouseUp}
                />
            </div>
            <button className="mute" onClick={() => gameStore.toggleMute()}>{gameStore.isMuted ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Volume-Control-Off--Streamline-Streamline-3.0.svg" height="24" width="24"><desc>Volume Control Off Streamline Icon: https://streamlinehq.com</desc><g><path d="m11 16.88 3.06 1.95a1.5 1.5 0 0 0 2.4 -1.2V13" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="M9.3 14.63H4.5a1.5 1.5 0 0 1 -1.5 -1.5v-3a1.5 1.5 0 0 1 1.5 -1.5h3l6.6 -4.21a1.5 1.5 0 0 1 2.4 1.21v3" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="m3 19.87 18 -15" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Volume-Control-Full--Streamline-Streamline-3.0.svg" height="24" width="24"><path d="M14.171 4.658A1.5 1.5 0 0 0 12.6 4.8L6 9H3a1.5 1.5 0 0 0 -1.5 1.5v3A1.5 1.5 0 0 0 3 15h3l6.6 4.2A1.5 1.5 0 0 0 15 18V6a1.5 1.5 0 0 0 -0.829 -1.342Z" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="M21.463 15.75a6.6 6.6 0 0 0 0 -7.1" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="M18.562 14.441a3.493 3.493 0 0 0 0 -4.405" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path><path d="m6 9 0 6" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>}</button>
            {gameStore.isGameOver && (
                <div className="modal">
                    <div className="modal__content">
                        <div className="modal__header">
                            <Logo noName={false} />
                        </div>
                        <div className="modal__title">
                            <ReactTyped
                                strings={["Game Over", "Share Your Score", "Try Again", "Merry Christmas", "HO! HO! HO!"]}
                                typeSpeed={50}
                                backSpeed={150}
                                backDelay={100}
                                startDelay={100}
                                showCursor={true}
                                cursorChar="|"
                            />
                        </div>
                        <div className="modal__social">
                            <a href="https://www.facebook.com/mono.software" className="modal__anchor"><svg viewBox="0 0 187 187" width={20} height={20} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"><rect height="187" rx="18" ry="18" width="187" fill="#485992" /><path d="M131 79V67c0-6 4-7 6-7h18V33h-24c-27 0-33 20-33 32v14H83v31h16v77h30v-77h23l1-12 2-19h-24z" fill="#fefefe" /></svg> @mono.software</a>
                            <a href="https://www.facebook.com/mono.software" className="modal__anchor"><svg version="1.1" viewBox="0 0 512 512" width={20} height={20} xmlns="http://www.w3.org/2000/svg">
                                <radialGradient cx="225.474" cy="222.805" gradientTransform="matrix(14.2175 0 0 14.2171 -3055.704 -2615.996)" gradientUnits="userSpaceOnUse" id="grad" r="47.721">
                                    <stop offset=".097" stopColor="#ffd87a" />
                                    <stop offset=".143" stopColor="#fcce78" />
                                    <stop offset=".226" stopColor="#f5b471" />
                                    <stop offset=".338" stopColor="#eb8d65" />
                                    <stop offset=".449" stopColor="#e36058" />
                                    <stop offset=".679" stopColor="#cd3694" />
                                    <stop offset="1" stopColor="#6668b0" />
                                </radialGradient>
                                <path d="M512 395.1c0 64.6-52.3 116.9-116.9 116.9H116.9C52.3 512 0 459.7 0 395.1V117C0 52.4 52.4 0 117 0h276.3C458.9 0 512 53.1 512 118.7v276.4z" fill="url(#grad)" />
                                <path d="M327.2 70.6H184.8c-63.1 0-114.3 51.2-114.3 114.3v142.3c0 63.1 51.1 114.2 114.3 114.2h142.3c63.1 0 114.2-51.1 114.2-114.2V184.9c.1-63.2-51-114.3-114.1-114.3zm78.6 242.9c0 51-41.3 92.3-92.3 92.3h-115c-51 0-92.3-41.3-92.3-92.3v-115c0-51 41.3-92.3 92.3-92.3h115c51 0 92.3 41.4 92.3 92.3v115z" fill="#ffffff" />
                                <path d="M261 159c-54 0-97.7 43.7-97.7 97.7 0 53.9 43.7 97.7 97.7 97.7 53.9 0 97.7-43.7 97.7-97.7-.1-54-43.8-97.7-97.7-97.7zm0 156.4c-32.5 0-58.8-26.3-58.8-58.8s26.3-58.8 58.8-58.8c32.4 0 58.8 26.3 58.8 58.8-.1 32.5-26.4 58.8-58.8 58.8zM376.7 157.5c0 13.7-11.1 24.8-24.8 24.8-13.7 0-24.8-11.1-24.8-24.8 0-13.7 11.1-24.9 24.8-24.9 13.7 0 24.8 11.1 24.8 24.9z" fill="#ffffff" />
                            </svg> @mono.software</a>
                            <a href="https://www.facebook.com/mono.software" className="modal__anchor"><svg viewBox="0 0 50 50" width={20} height={20} xmlns="http://www.w3.org/2000/svg"><path d="M45 1H5C2.8 1 1 2.8 1 5v40c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V5c0-2.2-1.8-4-4-4z" fill="#2CA7E0" /><path d="M40 16.2c-1.1.5-2.8 1.1-4 1.3 1.3-.8 2.5-2.6 3-4-1 .6-2.1 1.4-3.2 1.8l-.8-.8c-1.1-1.2-2.2-2-4-2-3.4 0-6 2.6-6 6 0 .4 0 .7.1 1H25c-6 0-10-1.3-13-5-.5.9-1 1.9-1 3 0 2.1 1.3 3.9 3 5-1 0-2.2-.5-3-1 0 3 4.2 6.4 7 7-1 1-4.6.1-5 0 .8 2.4 3.3 3.9 6 4-2.1 1.6-4.6 2.5-7.5 2.5-.5 0-1 0-1.5-.1 2.7 1.7 6.5 2.6 10 2.6 11.3 0 17-8.9 17-17v-1c1.2-.9 2.2-2.1 3-3.3z" fill="#FFF" /></svg> @mono.software</a>

                        </div>
                        <div className="modal__buttons">
                            <button onClick={handleRestart}>Restart Game</button>
                            <button onClick={downloadScreenshot}>Share your score</button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
});

export default GameCanvas;