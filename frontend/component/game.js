'use client';
import { EraseIcon, NoteIcon, PauseIcon, PlayIcon, UndoIcon } from '@/icons';
import styles from './game.module.css';
import { memo, useCallback, useEffect, useState } from 'react';
import { usecurrentselectcontext } from '@/context/currentselectcontext';
import { useHighScoreContext } from '@/context/high-score';
const numpadlist = [1, 2, 3, 4, 5, 6, 7, 8, 9];
function Game({ data, level, sessionId }) {
    //data:[[]], level: number
    const { setlisthighscore } = useHighScoreContext();
    const [noteactive, setnoteactive] = useState(false);
    console.log(sessionId);
    const [name, setname] = useState('');
    const initnumber = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const [currentboard, setcurrentboard] = useState({
        prev: [],
        current: initnumber,
    });

    const initdraft = [
        [[], [1, 2, 9], [], [], [], [], [], [], []],
        [[], [1], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
    ];
    const [currentdraft, setcurrentdraft] = useState(initdraft);
    const { currentselect, setcurrentselect } = usecurrentselectcontext();
    const erasehandler = useCallback(() => {
        const position = currentselect.position;
        if (data[position[0]][position[1]] == 0) {
            setcurrentselect({
                position,
                number: 0,
            });
            setcurrentboard((prev) => {
                console.log('prev: ', prev);
                const newcurrent = JSON.parse(JSON.stringify(prev.current));
                const newprev = [...prev.prev, JSON.parse(JSON.stringify(prev.current))];
                console.log(newprev);
                newcurrent[position[0]][position[1]] = 0;
                return { prev: newprev, current: newcurrent };
            });
            setcurrentdraft((prev) => {
                prev[position[0]][position[1]] = [];
                return prev;
            });
        }
    }, [currentselect.position, currentselect.number]);
    const undohandler = () => {
        setcurrentboard((prevstate) => {
            if (prevstate.prev.length > 0) {
                //setcurrent
                const newcurrent = JSON.parse(JSON.stringify(prevstate.prev[prevstate.prev.length - 1]));
                const newprev = prevstate.prev.slice(0, prevstate.prev.length - 1);

                return { prev: newprev, current: newcurrent };
            }
            return prevstate;
        });
    };
    const submithandler = async () => {
        seter('');
        setsuc('');
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentboard.current[i][j] == 0 && data[i][j] == 0) {
                    return seter(`Please fill in cell [${i},${j}]`);
                }
            }
        }
        const input = {
            puzzle: data,
            solution: currentboard.current,
        };

        console.log('submit called: ', input);

        try {
            // throw Error("haha")
            // 3. Tạo proof với snarkjs
            const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
                input,
                '/sudoku.wasm',
                '/sudoku.zkey',
            );
            const response = await fetch('http://localhost:3100/session/end-session', {
                method: 'POST',
                body: JSON.stringify({
                    proof,
                    publicSignals,
                    name,
                    sessionId,
                    level,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status == 400) {
                return seter('Please Reload To Play Again!');
            }
            if (response.status == 200) {
                const newItem = await response.json();
                console.log(newItem);
                setsuc('Your score has been saved!');
                setlisthighscore((prev) => {
                    const newstate = [...prev, newItem.data];
                    newstate.sort((a, b) => a.totalTime - b.totalTime);
                    return newstate;
                });
                setpause(true);
            } else {
                seter(response.status);
            }
        } catch (error) {
            return seter('Your solution not correct!');
        }
    };
    const [er, seter] = useState('');
    const [suc, setsuc] = useState('');
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Lấy mã phím từ sự kiện
            const key = event.key;
            console.log('press, ', key);
            // Kiểm tra nếu là số từ 1 đến 9
            if (key >= '1' && key <= '9') {
                const position = currentselect.position;
                if (noteactive) {
                    console.log('ok');
                    //update draft
                    setcurrentdraft((prev) => {
                        prev[position[0]][position[1]] = [...prev[position[0]][position[1]], Number(key)];
                        return JSON.parse(JSON.stringify(prev));
                    });
                }
                if (data[position[0]][position[1]] == 0 && !noteactive) {
                    setcurrentboard((prevstate) => {
                        const newprev = [...prevstate.prev, JSON.parse(JSON.stringify(prevstate.current))];
                        const current = [...JSON.parse(JSON.stringify(prevstate.current))];
                        current[position[0]][position[1]] = Number(key);
                        return {
                            prev: newprev,
                            current,
                        };
                    });
                }
            }
        };

        // Lắng nghe sự kiện keydown
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup sự kiện khi component bị hủy
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentselect.position, noteactive]);
    const [time, settime] = useState(0);
    const [pause, setpause] = useState(false);
    useEffect(() => {
        let inte;
        if (!pause) {
            inte = setInterval(() => {
                settime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(inte);
    }, [pause]);
    const timehandler = () => {
        console.log('click time');
    };
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Board data={data} currentnumber={currentboard.current} currentdraft={currentdraft} ispause={pause} />
                <div className={styles.interactive}>
                    <div className={styles.listbutton}>
                        <PauseButton
                            time={time}
                            onClick={timehandler}
                            pause={pause}
                            setpause={setpause}
                            sessionId={sessionId}
                        />
                        <EraseButton onClick={erasehandler} />
                        <NoteButton active={noteactive} onClick={() => setnoteactive((prev) => !prev)} />
                        <UndoButton onClick={undohandler} />
                    </div>
                    <div className={styles.numpadwrapper}>
                        {numpadlist.map((element) => (
                            <div
                                key={element}
                                className={styles.numpaditem}
                                onClick={() => {
                                    // update board
                                    const position = currentselect.position;
                                    if (noteactive) {
                                        console.log('ok');
                                        //update draft
                                        setcurrentdraft((prev) => {
                                            prev[position[0]][position[1]] = [
                                                ...prev[position[0]][position[1]],
                                                element,
                                            ];
                                            return JSON.parse(JSON.stringify(prev));
                                        });
                                    }
                                    if (data[position[0]][position[1]] == 0 && !noteactive) {
                                        setcurrentboard((prevstate) => {
                                            const newprev = [
                                                ...prevstate.prev,
                                                JSON.parse(JSON.stringify(prevstate.current)),
                                            ];
                                            const current = [...JSON.parse(JSON.stringify(prevstate.current))];
                                            current[position[0]][position[1]] = element;
                                            return {
                                                prev: newprev,
                                                current,
                                            };
                                        });
                                    }
                                }}
                            >
                                {element}
                            </div>
                        ))}
                    </div>
                    <div className={styles.space}>
                        {er && <div className={styles.error}>{er}</div>}
                        {suc && <div className={styles.success}>{suc}</div>}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            className={styles.inputname}
                            placeholder="Name"
                        />
                    </div>
                    <button className={styles.submit} onClick={submithandler}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

function BoardComponent({ currentnumber, currentdraft, data, ispause }) {
    return (
        <table className={styles.boardwrapper}>
            <tbody>
                {currentnumber.map((row, rowindex) => {
                    return (
                        <tr key={rowindex} className={styles.boardrow}>
                            {row.map((col, colindex) => {
                                let x;
                                const isorigin = data[rowindex][colindex] > 0;
                                if (isorigin) {
                                    x = data[rowindex][colindex];
                                } else {
                                    x = col;
                                }

                                return (
                                    <Cell
                                        key={colindex}
                                        number={x}
                                        draftlist={currentdraft[rowindex][colindex]}
                                        isorigin={isorigin}
                                        rowindex={rowindex}
                                        ispause={ispause}
                                        colindex={colindex}
                                    />
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
const Board = memo(BoardComponent);
function CellComponent({ draftlist, number, isorigin, colindex, rowindex, ispause }) {
    //key==col
    //draftlist:[],number
    const { currentselect, setcurrentselect } = usecurrentselectcontext();
    const a = rowindex == currentselect.position[0];
    const b = colindex == currentselect.position[1];
    const c =
        Math.floor(rowindex / 3) == Math.floor(currentselect.position[0] / 3) &&
        Math.floor(colindex / 3) == Math.floor(currentselect.position[1] / 3);

    return (
        <td
            className={
                `${styles.cellcontainer} ` +
                [(a || b || c) && ` ${styles.effectaround} `] +
                (currentselect.position[0] == rowindex &&
                    currentselect.position[1] == colindex &&
                    ` ${styles.currentselect}`)
            }
            onClick={() => {
                setcurrentselect({
                    position: [rowindex, colindex],
                    number: number,
                });
            }}
        >
            {!isorigin && number == 0 && !ispause && (
                <div className={styles.draftcontainer}>
                    {numpadlist.map((element, index) => {
                        let x = '';
                        if (draftlist.includes(element)) x = `${element}`;
                        return (
                            <div
                                key={index}
                                className={
                                    `${styles.draftitem} ` +
                                    (Number(x) == currentselect.number && ` ${styles.draftactive}`)
                                }
                            >
                                {x}
                            </div>
                        );
                    })}
                </div>
            )}
            {Number(number) > 0 && !ispause && (
                <div
                    className={
                        `${styles.cellnumber} ` +
                        [number == currentselect.number && ` ${styles.activenumber} `] +
                        +[isorigin == true ? ` ${styles.origincell}` : ''] +
                        (isorigin ? ` ${styles.origincell}` : '')
                    }
                >
                    {number}
                </div>
            )}
        </td>
    );
}
const Cell = memo(CellComponent);
function UndoButtonC({ onClick }) {
    return (
        <div className={styles.buttonwrapper} onClick={onClick}>
            <div className={styles.iconwrapper}>
                <UndoIcon />
            </div>
            <div className={styles.buttontext}>Undo</div>
        </div>
    );
}
const UndoButton = memo(UndoButtonC);
function EraseButton({ onClick }) {
    return (
        <div className={styles.buttonwrapper} onClick={onClick}>
            <div className={styles.iconwrapper}>
                <EraseIcon />
            </div>
            <div className={styles.buttontext}>Erase</div>
        </div>
    );
}
function NoteButton({ active, onClick }) {
    return (
        <div className={styles.buttonwrapper} onClick={onClick}>
            <div className={styles.iconwrapper + (active ? ` ${styles.noteactive}` : '')}>
                <NoteIcon />
            </div>
            <div className={styles.buttontext}>Notes</div>
        </div>
    );
}
function PauseButtonC({ time, onClick, pause, setpause, sessionId }) {
    return (
        <div
            className={styles.buttonwrapper}
            onClick={async () => {
                console.log('Function called');
                if (pause) {
                    console.log(pause ? 'pause' : 'starting');
                    //pause ===>start
                    try {
                        const response = await fetch(`http://localhost:3100/session/start-session/${sessionId}`);
                        if (response.status != 200) {
                            throw Error('Failed to fetch');
                        }
                        setpause(false);
                    } catch (err) {
                        console.log(err.message);
                    }
                } else {
                    try {
                        //starting==>pausetry {
                        const response = await fetch(`http://localhost:3100/session/pause-session/${sessionId}`);
                        if (response.status != 200) {
                            throw Error('Failed to fetch');
                        }
                        return setpause(true);
                    } catch (err) {
                        console.log(err.message);
                    }
                }

                console.log('inside setpvause');
            }}
        >
            <div className={styles.iconwrapper}>{pause ? <PlayIcon /> : <PauseIcon />}</div>
            <div className={styles.buttontext}>
                {`${String(Math.floor(time / 60)).padStart(2, '0')}: ${String(time % 60).padStart(2, '0')}`}
            </div>
        </div>
    );
}
const PauseButton = memo(PauseButtonC);

export default Game;
