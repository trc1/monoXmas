import { ReactTyped } from "react-typed";
import gameStore from "../store/gameStore";

export default function Loader() {
    return (
        <div className="loader">
            <h1 className="loader__title">
                <ReactTyped
                    strings={["Merry Christmas", "and Happy New Year"]}
                    typeSpeed={300}
                    backSpeed={50}
                    backDelay={200}
                    startDelay={200}
                    showCursor={true}
                    cursorChar="|"
                />
            </h1>
            <ol className="loader__content">
                <h3 className="loader__subtitle">Help Santa deliver gifts 🎅🎁</h3>
                <li className="loader__text">The objective of the game is to help Santa deliver as many gifts as possible by carefully extending the stick to connect the rooftops. Make sure the stick is the right length—too short or too long, and Santa will fall! Keep Santa steady and avoid missing rooftops to achieve the highest score. How many gifts can you deliver before Santa takes a tumble?</li>
                <li className="loader__text">Press and hold anywhere on the screen to grow the stick. Release to drop the stick and help Santa cross to the next rooftop.</li>
                <li className="loader__text">Share your score with the rest of the world and tag Mono at social networks.</li>
                <li className="loader__text">The best sent score will get our bag of goodies.</li>
                <li className="loader__text">Have a holly jolly fun from Mono!</li>
            </ol>

            <div className="loader__description">
                <span>* Santa is shipping only to Croatia!</span>
                <span>* If there are multiple players with the same highest score, we will use a random online tool to select a winner.</span>
            </div>

            <button
                onClick={() => {
                    gameStore.startGame();
                }}
            >
                Play Game
            </button>
        </div>
    );
}
