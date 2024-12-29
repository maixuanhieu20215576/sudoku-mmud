import Game from '@/component/game';
import HighScore from '@/component/high-score';
import styles from './page.module.css';
async function Level({ params }) {
    const { level } = await params;
    const x = JSON.stringify([
        [1, 0, 0, 4, 0, 0, 8, 2, 0],
        [0, 6, 0, 0, 5, 0, 0, 0, 0],
        [0, 0, 0, 1, 9, 0, 0, 3, 5],
        [3, 0, 5, 0, 1, 4, 2, 7, 9],
        [6, 2, 1, 0, 7, 8, 0, 5, 4],
        [0, 9, 0, 0, 2, 3, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0, 8],
        [5, 0, 8, 0, 4, 0, 0, 0, 0],
        [0, 4, 6, 0, 0, 0, 5, 9, 0],
    ]);
    const leveldata = JSON.parse(x);

    const highscoredata = [
        { name: 'xuanhieu', totalTime: '1:00' },
        { name: 'tienthanh', totalTime: '2:00' },
        { name: 'nguyenhuy', totalTime: '3:00' },
        { name: 'sontungmtp', totalTime: '4:00' },
        { name: 'hieuthu2', totalTime: '10:00' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 style={{ fontSize: '1.5rem', padding: '0', margin: '0' }}>Level {level}</h1>
            </div>
            <div className={styles.content}>
                <HighScore data={highscoredata} level={level} />
                <Game data={leveldata} level={level} />
            </div>
        </div>
    );
}

export default Level;
