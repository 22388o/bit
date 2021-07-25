import { Command, CommandOptions } from '@teambit/cli';
import chalk from 'chalk';
import { ScopeMain } from '@teambit/scope';
import { BuilderMain } from '../builder.main.runtime';
import { ArtifactExtractor, ExtractorArtifactResult, ExtractorResultGrouped } from './artifact-extractor';

const INDENT_TITLE = ' '.repeat(2);
const INDENT_SUB_TITLE = ' '.repeat(4);
const INDENT_FILES = ' '.repeat(6);

export type ArtifactsOpts = {
  aspect?: string;
  task?: string;
  files?: string;
  outDir?: string;
};

export class ArtifactsCmd implements Command {
  name = 'artifacts <pattern...>';
  description = 'EXPERIMENTAL. list and download components artifacts';
  alias = '';
  group = 'development';
  options = [
    ['', 'aspect <aspect-id>', 'show/download only artifacts generated by this aspect-id'],
    ['', 'task <task-id>', 'show/download only artifacts generated by this task-id'],
    [
      '',
      'files <glob>',
      'show/download only artifacts matching the given files or the glob pattern (wrap glob patterns in quotes)',
    ],
    ['', 'out-dir <string>', 'download the files to the specified dir'],
  ] as CommandOptions;

  constructor(private builder: BuilderMain, private scope: ScopeMain) {}

  async report([userPattern]: [string[]], artifactsOpts: ArtifactsOpts): Promise<string> {
    const artifactExtractor = new ArtifactExtractor(this.scope, this.builder, userPattern, artifactsOpts);
    const list = await artifactExtractor.list();
    const grouped = artifactExtractor.groupResultsByAspect(list);
    const outputArtifacts = (aspectId: string, artifactData: ExtractorArtifactResult[]) => {
      const title = chalk.green(aspectId);
      const artifactDataStr = artifactData
        .map((artifact) => {
          const subTitle = chalk.white(artifact.taskName);
          const files = artifact.files.map((f) => INDENT_FILES + chalk.dim(f)).join('\n');
          return `${INDENT_SUB_TITLE}${subTitle}\n${files}`;
        })
        .join('\n');
      return `${INDENT_TITLE}${title}\n${artifactDataStr}`;
    };
    const outputResult = (result: ExtractorResultGrouped) => {
      const idStr = chalk.cyan(result.id.toString());
      const artifacts = Object.keys(result.artifacts)
        .map((aspectId) => outputArtifacts(aspectId, result.artifacts[aspectId]))
        .join('\n\n');
      return `${idStr}\n${artifacts}`;
    };
    const footer = artifactsOpts.outDir
      ? chalk.green('\n\nThe above files were saved successfully to the file system')
      : '';
    return grouped.map(outputResult).join('\n\n') + footer;
  }
}
