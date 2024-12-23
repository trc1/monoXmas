import Snowfall from "react-snowfall";
import GameCanvas from "./components/GameCanvas";
import "./style/app.scss";
import Loader from "./components/Loader";
import gameStore from "./store/gameStore";
import { observer } from "mobx-react-lite";
import Header from "./components/Header";

const App = observer(() => {
    return (
        <>
            <Header />
            <div className="content">
                {!gameStore.showGame && <Loader />}
                {gameStore.showGame && <GameCanvas />}
            </div>
            <Snowfall snowflakeCount={300} style={{ opacity: 0.5 }} />
        </>
    );
})

export default App;
