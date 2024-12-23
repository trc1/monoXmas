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
