import React, { HTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import { HoverSplitter } from '@teambit/base-ui.surfaces.split-pane.hover-splitter';
import { Collapser } from '@teambit/ui-foundation.ui.buttons.collapser';
import { SplitPane, Pane, Layout } from '@teambit/base-ui.surfaces.split-pane.split-pane';
import { useIsMobile } from '@teambit/ui-foundation.ui.hooks.use-is-mobile';
import { FileIconSlot } from '@teambit/code';
import { ComponentCompareCodeTree, ComponentCompareCodeView } from '@teambit/component.ui.component-compare-code';
import {
  useComponentCompareParams,
  useComponentCompareContext,
} from '@teambit/component.ui.component-compare';
import { CompareStatus, ComponentCompareStatusResolver } from '@teambit/component.ui.component-compare-status-resolver';
import { useFileContent } from '@teambit/code.ui.queries.get-file-content';

import { useCode } from '@teambit/code.ui.queries.get-component-code';

import styles from './component-compare-code.module.scss';

const DEFAULT_FILE = 'index.ts';

export type ComponentCompareCodeProps = {
  fileIconSlot?: FileIconSlot;
} & HTMLAttributes<HTMLDivElement>;

export function ComponentCompareCode({ fileIconSlot, className }: ComponentCompareCodeProps) {
  const componentCompareContext = useComponentCompareContext();

  const { base, compare } = componentCompareContext || {};

  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpenness] = useState(!isMobile);
  const sidebarOpenness = isSidebarOpen ? Layout.row : Layout.left;

  const { fileTree: baseFileTree = [], mainFile } = useCode(base?.id);
  const { fileTree: compareFileTree = [] } = useCode(compare?.id);

  const fileTree = baseFileTree.concat(compareFileTree);
  const params = useComponentCompareParams();
  const selectedFile = params?.selectedFile || mainFile || DEFAULT_FILE;

  return (
    <SplitPane
      layout={sidebarOpenness}
      size="85%"
      className={classNames(styles.componentCompareCodeContainer, className)}
    >
      <Pane className={styles.left}>
        <ComponentCompareCodeView base={base} compare={compare} fileName={selectedFile} />
      </Pane>
      <HoverSplitter className={styles.splitter}>
        <Collapser
          placement="left"
          isOpen={isSidebarOpen}
          onMouseDown={(e) => e.stopPropagation()} // avoid split-pane drag
          onClick={() => setSidebarOpenness((x) => !x)}
          tooltipContent={`${isSidebarOpen ? 'Hide' : 'Show'} file tree`}
          className={styles.collapser}
        />
      </HoverSplitter>
      <Pane className={classNames(styles.right, styles.dark)}>
        <ComponentCompareCodeTree
          fileIconSlot={fileIconSlot}
          fileTree={fileTree}
          currentFile={selectedFile}
          drawerName={'FILES'}
          queryParam={'selectedFile'}
          getWidgets={getWidgets}
        />
      </Pane>
    </SplitPane>
  );
}

function getWidgets(fileName: string) {
  const componentCompareContext = useComponentCompareContext();
  const base = componentCompareContext?.base;
  const compare = componentCompareContext?.compare;

  const { fileContent: originalFileContent, loading: originalLoading } = useFileContent(base?.id, fileName);
  const { fileContent: modifiedFileContent, loading: modifiedLoading } = useFileContent(compare?.id, fileName);

  if (originalLoading || modifiedLoading) return null;

  let status: CompareStatus | undefined;
  if (!originalFileContent && modifiedFileContent) {
    status = 'new';
  } else if (!modifiedFileContent && originalFileContent) {
    status = 'deleted';
  } else if (modifiedFileContent !== originalFileContent) {
    status = 'modified';
  }

  if(!status) return null;

  return [() => <ComponentCompareStatusResolver status={status as CompareStatus}/>] 
}