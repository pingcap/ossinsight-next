import { parseWithPointers } from '@stoplight/json';
import type { ESLint, Linter } from 'eslint';
import fs from 'fs';
import { validateRefDatasource } from './rules/datasource-ref';
import { ajv, transformJsonSchemaErrorObject } from './utils';

const datasourceSchema = ajv.compile(require('../../../schemas/widget/v1/datasource-schema.json'));
const paramsSchema = ajv.compile(require('../../../schemas/widget/v1/parameters-schema.json'));

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
        const source = fs.readFileSync(filename, { encoding: 'utf-8' });
        const result = parseWithPointers(source);
        const res = paramsSchema(result.data);

        if (res) {
          return [].concat(...messages);
        }

        return ([] as Linter.LintMessage[])
          .concat(...messages)
          .concat(...transformJsonSchemaErrorObject('ossinsight/params-schema', result, paramsSchema.errors));
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
        const source = fs.readFileSync(filename, { encoding: 'utf-8' });
        const result = parseWithPointers(source);
        const res = datasourceSchema(result.data);

        function validateDatasource (datasource: any, i: number | undefined): Linter.LintMessage[] {
          if (datasource instanceof Array) {
            return datasource.flatMap(validateDatasource);
          } else {
            switch (datasource.type) {
              case 'api':
                return [];
              case 'ref':
                return validateRefDatasource(result, datasource, i);
            }
          }
        }

        const validatorMessages = validateDatasource(result.data, undefined);

        if (res) {
          return validatorMessages.concat(...messages);
        }

        return validatorMessages
          .concat(...messages)
          .concat(...transformJsonSchemaErrorObject('ossinsight/datasource-schema', result, datasourceSchema.errors));
      },
    },
  },
  rules: {
    'ossinsight/params-schema': {
      create () {
        return {};
      },
    },
    'ossinsight/datasource-schema': {
      create () {
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
