import { DiffEditor, DiffEditorProps, DiffOnMount } from '@monaco-editor/react';
import { useFileContent } from '@teambit/code.ui.queries.get-file-content';
import { ComponentModel } from '@teambit/component';
import { Toggle } from '@teambit/design.ui.input.toggle';
import { H4 } from '@teambit/documenter.ui.heading';
import classNames from 'classnames';
import React, { HTMLAttributes, useMemo, useRef, useState } from 'react';
import styles from './code-compare-view.module.scss';

export type CodeCompareViewProps = {
  base?: ComponentModel;
  compare?: ComponentModel;
  fileName: string;
} & HTMLAttributes<HTMLDivElement>;

// a translation list of specific monaco languages that are not the same as their file ending.
const languages = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mdx: 'markdown',
  md: 'markdown',
};

export function CodeCompareView({ className, base, compare, fileName }: CodeCompareViewProps) {
  const { fileContent: originalFileContent, loading: originalLoading } = useFileContent(base?.id, fileName);
  const { fileContent: modifiedFileContent, loading: modifiedLoading } = useFileContent(compare?.id, fileName);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const monacoRef = useRef<any>();

  const title = useMemo(() => fileName?.split('/').pop(), [fileName]);

  const language = useMemo(() => {
    if (!fileName) return languages.ts;
    const fileEnding = fileName?.split('.').pop();
    return languages[fileEnding || ''] || fileEnding;
  }, [fileName]);

  if (originalLoading || modifiedLoading) return null;

  // this disables ts errors in editor
  const handleEditorDidMount: DiffOnMount = (_, monaco) => {
    monacoRef.current = monaco;
    if (monacoRef.current) {
      monacoRef.current.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    }
  };

  const diffEditorProps: DiffEditorProps = {
    modified: modifiedFileContent,
    original: originalFileContent,
    language,
    height: '100%',
    onMount: handleEditorDidMount,
    className: styles.diffEditor,
    theme: 'vs-dark',
    options: {
      ignoreTrimWhitespace: ignoreWhitespace,
      readOnly: true
    },
  };

  const onIgnoreWhitespaceToggled = () => {
    setIgnoreWhitespace((exsitingState) => !exsitingState);
  };

  return (
    <div
      key={`component-compare-code-view-${fileName}`}
      className={classNames(styles.componentCompareCodeViewContainer, className)}
    >
      <div className={styles.fileName}>
        <H4 size="xs" className={styles.fileName}>
          <span>{title}</span>
        </H4>
      </div>
      <div className={styles.ignoreWhitespaceControlContainer}>
        <div className={styles.toggleContainer}>
          <Toggle checked={ignoreWhitespace} onInputChanged={onIgnoreWhitespaceToggled} className={styles.toggle} />
          Ignore Whitespace
        </div>
      </div>
      <div className={styles.componentCompareCodeDiffEditorContainer}>
        <DiffEditor {...diffEditorProps} />
      </div>
    </div>
  );
}
