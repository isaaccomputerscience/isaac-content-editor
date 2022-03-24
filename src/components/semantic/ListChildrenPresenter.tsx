import React, { useState } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";
import { Box, PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./styles.module.css";

interface InserterProps {
    insert: (newContent: Content) => void;
    open: boolean;
}

export const emptyContent = {type: "content", encoding: "markdown", value: "", __empty: true}; // TODO: filter these out from saving to server

function InsertButton(props: { onClick: () => void }) {
    return <div className={styles.inserterAdd}>
        <Button color="link" size="lg" onClick={props.onClick}>➕</Button>
    </div>;
}

function Inserter({insert, open}: InserterProps) {
    const [isInserting, setInserting] = useState(open);
    return <div className={styles.inserter}>
        {!isInserting && <InsertButton onClick={() => setInserting(true)}/>}
        {isInserting && <Box name="?" onDelete={() => setInserting(false)}>
            <p>Please choose a block type:</p>
            <Button color="link" onClick={() => {
                insert({...emptyContent});
                setInserting(false);
            }}>Content</Button>
        </Box>}
    </div>;
}

export const emptyChoice = {type: "choice", encoding: "markdown", value: "", explanation: {type: "content", children: []}, correct: false};

function ChoiceInserter({insert}: InserterProps) {
    return <div className={styles.inserter}>
        <InsertButton onClick={() => insert({...emptyChoice})} />
    </div>;
}

export function deriveNewDoc(doc: Content) {
    const newContent = {
        ...doc,
        children: doc.children ? [...doc.children] : [],
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete newContent.__empty;
    return newContent;
}

function isEmpty(doc: Content) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return doc.__empty === true;
}

function selectInserter(doc: Content) {
    switch (doc.type) {
        case "choices":
            return ChoiceInserter;
        default:
            return Inserter;
    }
}

export function ListChildrenPresenter({doc, update}: PresenterProps) {
    const result: JSX.Element[] = [];

    function addInserter(position: number, open: boolean) {
        const UseInserter = selectInserter(doc);
        result.push(<UseInserter key={`__insert_${position}_${open}`} open={open} insert={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(position, 0, newContent);
            update(newDoc);
        }} />);
    }

    doc.children?.forEach((child, index) => {
        addInserter(index, false);
        result.push(<SemanticItem key={child.id || `_child_${index}`} doc={child as Content} update={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children[index] = newContent;
            update(newDoc);
        }} onDelete={() => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(index, 1);
            update(newDoc);
        }}/>);
    });
    addInserter(doc.children?.length || 0, isEmpty(doc));
    return <>
        {result}
    </>;
}
