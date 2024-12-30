import Game from '@/component/game';
import HighScore from '@/component/high-score';
import styles from './page.module.css';
import { ModeContextWrapper } from '@/context/modecontext';
import { CurrentSelectContextWrapper } from '@/context/currentselectcontext';
import { HighScoreContextProvider } from '@/context/high-score';
import Button from '@/component/next';
async function Level({ params }) {
    const { level } = await params;
    console.log(level);
    const response = await fetch('http://localhost:3100/session/start-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ levelId: level }),
    });
    if (response.status != 200) {
        throw Error('Can not get level data');
    }

    const responseObject = await response.json();

    console.log('response:', responseObject);
    const response1 = await fetch(process.env.BACKEND_URL + `/level/get-level-info/${level}`, {
        method: 'GET',
    });
    if (response1.status !== 200) {
        throw Error('Can not get high score');
    }
    const gamedata = await response1.json();

    if (!gamedata.levelInfo) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 style={{ fontSize: '1.5rem', padding: '0', margin: '0' }}>Level {level}</h1>
                </div>
                <div className={styles.content}>Comming soon...</div>
            </div>
        );
    }

    //get highscore
    const response2 = await fetch('http://localhost:3100/session/get-high-score', {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify({ level }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response2.status != 200) {
        throw Error('Internal Server Error');
    }
    const highscore = await response2.json();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 style={{ fontSize: '1.5rem', padding: '0', margin: '0' }}>Level {level}</h1>
                <Button />
            </div>
            <div className={styles.content}>
                <HighScoreContextProvider inithighscore={highscore.highScore}>
                    <HighScore level={level} />
                    <ModeContextWrapper>
                        <CurrentSelectContextWrapper>
                            <Game
                                data={gamedata.levelInfo.levelData}
                                level={level}
                                sessionId={responseObject.sessionId}
                            />
                        </CurrentSelectContextWrapper>
                    </ModeContextWrapper>
                </HighScoreContextProvider>
            </div>
        </div>
    );
}

export default Level;
