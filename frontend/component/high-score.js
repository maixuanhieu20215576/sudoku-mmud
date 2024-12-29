import styles from './high-score.module.css';
const fakelist = [
    { name: 'xuanhieu', totalTime: '1:00' },
    { name: 'tienthanh', totalTime: '2:00' },
    { name: 'sontungmtp', totalTime: '5:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
    { name: 'hieuThu2', totalTime: '10:00' },
];
function HighScore({ data, level }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>High Score</h2>
            <div className={styles.scorewrapper}>
                {fakelist.map((item, index) => {
                    return <HighScoreItem key={index} data={item} index={index + 1} />;
                })}
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

export default HighScore;
