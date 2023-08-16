import { Rule } from 'eslint';
import type { ESLint, Linter } from 'eslint';

const plugin: ESLint.Plugin = {
  processors: {
    'params': {
      supportsAutofix: false,
      preprocess (text: string, filename: string): (string | Linter.ProcessorFile)[] {
        if (/^|\/params\.json$/.test(filename)) {
          return [{ text, filename }];
        }
        return [];
      },
      postprocess (messages: Linter.LintMessage[][], filename: string): Linter.LintMessage[] {
        return ([] as Linter.LintMessage[])
          .concat(...messages)
          .concat({
            ruleId: 'ossinsight/params-schema',
            column: 0,
            line: 0,
            endColumn: 0,
            endLine: 0,
            severity: 1,
            message: 'Does not match schema',
          });
      },

    },
    'datasource': {
      supportsAutofix: false,
      preprocess (text: string, filename: string): (string | Linter.ProcessorFile)[] {
        if (/^|\/datasource\.json$/.test(filename)) {
          return [{ text, filename }];
        }
        return [];
      },
      postprocess (messages: Linter.LintMessage[][], filename: string): Linter.LintMessage[] {
        return ([] as Linter.LintMessage[])
          .concat(...messages)
          .concat({
            ruleId: 'ossinsight/datasource-schema',
            column: 0,
            line: 0,
            endColumn: 0,
            endLine: 0,
            severity: 1,
            message: 'Does not match schema',
          });
      },
    },
  },
  rules: {
    'ossinsight/params-schema': {
      create (context: Rule.RuleContext) {
        return {};
      },
    },
    'ossinsight/datasource-schema': {
      create (context: Rule.RuleContext) {
        return {};
      },
    },
  },
  configs: {
    'recommended': {
      overrides: [
        {
          files: '*/params.json',
          plugins: ['ossinsight'],
          parser: 'jsonc-eslint-parser',
          processor: 'ossinsight/params',
          rules: {
            'ossinsight/*': 2,
          },
        },
        {
          files: '*/datasource.json',
          plugins: ['ossinsight'],
          parser: 'jsonc-eslint-parser',
          processor: 'ossinsight/datasource',
          rules: {
            'ossinsight/*': 2,
          },
        },
      ],
    },
  },
};

export = plugin;
