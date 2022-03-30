import React from "react";

import { GlossaryTerm } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import styles from "./glossaryTerm.module.css"
import { SemanticDocProp } from "./SemanticDocProp";
import { EditableIDProp, EditableValueProp } from "./EditableDocProp";

export function GlossaryTermPresenter(props: PresenterProps<GlossaryTerm>) {
    return <div className={styles.wrapper}>
        <div className={styles.controls}>
            <EditableValueProp {...props} placeHolder="Glossary term" block />
            <EditableIDProp {...props} label="Term ID" block />
        </div>
        <div className={styles.explanation}>
            <SemanticDocProp {...props} prop="explanation" />
        </div>
    </div>;
    // TODO: glossary tags
}
