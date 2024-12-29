'use client';
import { EraseIcon, NoteIcon, PauseIcon, UndoIcon } from '@/icons';
import styles from './game.module.css';
import { memo, useState } from 'react';
const numpadlist = [1, 2, 3, 4, 5, 6, 7, 8, 9];
function Game({ data, level }) {
    //data:[[]], level: number
    const initnumber = [
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
        [0, 0, 0, 1, 2, 3, 4, 2, 1],
    ];
    const [currentnumber, setcurrentnumber] = useState(initnumber);

    const initdraft = [
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
    ];
    const [currentdraft, setcurrentdraft] = useState(initdraft);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Board data={data} currentnumber={currentnumber} currentdraft={currentdraft} />
                <div className={styles.interactive}>
                    <div className={styles.listbutton}>
                        <PauseButton />
                        <EraseButton />
                        <NoteButton />
                        <UndoButton />
                    </div>
                    <div className={styles.numpadwrapper}>
                        {numpadlist.map((element) => (
                            <div key={element} className={styles.numpaditem}>
                                {element}
                            </div>
                        ))}
                    </div>
                    <div className={styles.space}></div>
                    <button className={styles.submit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

function BoardComponent({ currentnumber, currentdraft, data }) {
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
                                        number={col}
                                        draftlist={currentdraft[rowindex][colindex]}
                                        isorigin={isorigin}
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
function CellComponent({ draftlist, number, isorigin }) {
    //draftlist:[],number
    return (
        <td className={styles.cellcontainer}>
            {!isorigin && number == 0 && (
                <div className={styles.draftcontainer}>
                    {numpadlist.map((element, index) => {
                        let x = '';
                        if (draftlist.includes(element)) x = `${element}`;
                        return (
                            <div key={index} className={styles.draftitem}>
                                {x}
                            </div>
                        );
                    })}
                </div>
            )}
            {Number(number) > 0 && (
                <div className={styles.cellnumber + (isorigin ? ` ${styles.origincell}` : '')}>{number}</div>
            )}
        </td>
    );
}
const Cell = memo(CellComponent);
function UndoButton() {
    return (
        <div className={styles.buttonwrapper}>
            <div className={styles.iconwrapper}>
                <UndoIcon />
            </div>
            <div className={styles.buttontext}>Undo</div>
        </div>
    );
}
function EraseButton() {
    return (
        <div className={styles.buttonwrapper}>
            <div className={styles.iconwrapper}>
                <EraseIcon />
            </div>
            <div className={styles.buttontext}>Erase</div>
        </div>
    );
}
function NoteButton() {
    return (
        <div className={styles.buttonwrapper}>
            <div className={styles.iconwrapper}>
                <NoteIcon />
            </div>
            <div className={styles.buttontext}>Notes</div>
        </div>
    );
}
function PauseButton() {
    return (
        <div className={styles.buttonwrapper}>
            <div className={styles.iconwrapper}>
                <PauseIcon />
            </div>
            <div className={styles.buttontext}>22:21</div>
        </div>
    );
}

export default Game;
