'use client';

const { createContext, useContext, useState } = require('react');

const modecontext = createContext();
export const ModeContextWrapper = (props) => {
    const [mode, setmode] = useState('normal'); //normal/note
    return <modecontext.Provider value={{ mode, setmode }}>{props.children}</modecontext.Provider>;
};
export const usemodecontext = () => useContext(modecontext);
