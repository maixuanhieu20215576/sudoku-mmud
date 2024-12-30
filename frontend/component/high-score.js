'use client';
import { useHighScoreContext } from '@/context/high-score';
import styles from './high-score.module.css';
import { memo } from 'react';

function HighScore({ level }) {
    const { listhighscore } = useHighScoreContext();
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>High Score</h2>
            <div className={styles.scorewrapper}>
                {listhighscore.map((item, index) => (
                    <HighScoreItem key={item._id} index={index + 1} data={item} />
                ))}
            </div>
        </div>
    );
}
function HighScoreItem({ data, index }) {
    return (
        <div className={styles.itemcontainer}>
            <span className={styles.index}>{index}</span>
            <span className={styles.name}>{data.name}</span>
            <span className={styles.time}>{data.totalTime}</span>
        </div>
    );
}

export default memo(HighScore);
