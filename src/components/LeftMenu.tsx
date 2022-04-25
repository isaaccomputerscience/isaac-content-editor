import React, { useContext, useLayoutEffect, useState } from "react";

import { AppContext } from "../App";
import { FileBrowser, pathToId } from "./FileBrowser";

import styles from "../styles/editor.module.css";
import { dirname } from "../utils/strings";

function scrollPathIntoView(path: string) {
    const item = document.getElementById(pathToId(path));
    item?.scrollIntoView({block: "start", inline: "start", behavior: "smooth"});
    return item !== undefined;
}

export function LeftMenu() {
    const appContext = useContext(AppContext);

    const selection = appContext.selection.getSelection();
    const path = selection?.path;

    const [isSetOpen, setOpen] = useState(true);
    const isOpen = isSetOpen || selection === null || selection.isDir;

    // Run this on first load only
    useLayoutEffect(() => {
        function tryAgain() {
            if (path) {
                if (!scrollPathIntoView(path)) {
                    // FIXME: stop trying if there is an error
                    if (path === selection?.path) {
                        setTimeout(tryAgain, 250);
                    }
                }
            }
        }
        tryAgain();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className={`${styles.leftMenuWrapper} ${isOpen ? styles.leftMenuOpen : styles.leftMenuClosed}`}>
        <button className={styles.leftMenuOpener} onClick={() => setOpen(!isOpen)}>◀</button>
        <header className={styles.leftMenuHeader}>
            <button className={styles.iconButton} onClick={() => {
                const basePath = selection?.isDir ? selection?.path : dirname(selection?.path);
                if (basePath) {
                    appContext.dispatch({type: "new", path: basePath});
                }
            }}>
                New...
            </button>
            <button className={`${styles.iconButton} ${styles.sm}`} onClick={() => {
                if (selection) {
                    const path = selection.path;
                    scrollPathIntoView(path);
                }
            }}>🔍</button>
        </header>
        <FileBrowser />
    </div>;
}
