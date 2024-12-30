'use client';

import { createContext, useContext, useState } from 'react';

const currentselectcontext = createContext();
export const CurrentSelectContextWrapper = (props) => {
    const [currentselect, setcurrentselect] = useState({
        position: [0, 0],
        number: 1,
    });

    return (
        <currentselectcontext.Provider value={{ currentselect, setcurrentselect }}>
            {props.children}
        </currentselectcontext.Provider>
    );
};
export const usecurrentselectcontext = () => useContext(currentselectcontext);
