'use client';

const { createContext, useState, useContext } = require('react');

const highScoreContext = createContext();
export const HighScoreContextProvider = (props) => {
    const [listhighscore, setlisthighscore] = useState(props.inithighscore);
    return (
        <highScoreContext.Provider value={{ listhighscore, setlisthighscore }}>
            {props.children}
        </highScoreContext.Provider>
    );
};
export const useHighScoreContext = () => useContext(highScoreContext);
