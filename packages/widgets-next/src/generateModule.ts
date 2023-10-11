import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

export function generateModule () {
  const base = process.cwd();
  const widgetsPath = path.resolve(base, '../widgets');

  const pkgs = glob.sync('**/*/package.json', {
    ignore: ['**/node_modules/**'],
    cwd: widgetsPath,
  });

  const widgets: Record<string, string> = {};

  let src = `// This file is generated by @ossinsight/next
const widgets = {}
const visualizers = {}
const datasourceFetchers = {}
const parameterDefinitions = {}
const metadataGenerators = {}
`;

  pkgs.forEach(folder => {
    const dir = path.dirname(folder);

    const pkg = path.join(widgetsPath, dir, 'package.json');
    if (!fs.existsSync(pkg)) {
      return;
    }

    const { name, version, private: privateVal, keywords, description, author, main, module } = require(pkg);
    const meta = { name, version, private: privateVal, keywords, description, author };
    widgets[name] = path.resolve(widgetsPath, dir);

    const quotedName = JSON.stringify(name);
    const visPath = JSON.stringify(path.join(name, main || module || 'visualization.ts'));
    const dataPath = JSON.stringify(path.join(name, 'datasource.json'));
    const paramsPath = JSON.stringify(path.join(name, 'params.json'));
    const metadataPath = JSON.stringify(path.join(name, 'metadata.ts'));

    src += `widgets[${quotedName}] = ${JSON.stringify(meta)}\n`;

    src += `visualizers[${quotedName}] = () => import(${visPath})\n`;

    src += `datasourceFetchers[${quotedName}] = (ctx, signal) => Promise.all([import(${dataPath}), import('@ossinsight/widgets-core/src/datasource')]).then(([jsonModule, core]) => core.default(jsonModule.default, ctx, signal))\n`;

    src += `parameterDefinitions[${quotedName}] = () => import(${paramsPath}).then(module => module.default)\n`;

    src += `metadataGenerators[${quotedName}] = () => import(${metadataPath}).then(module => module.default)\n`;
  });

  src += 'export default widgets\n';
  src += 'export { visualizers, datasourceFetchers, parameterDefinitions, metadataGenerators }\n';

  const filepath = path.resolve(base, 'node_modules/@ossinsight/widgets/index.js');
  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  fs.writeFileSync(filepath, src);

  return widgets;
}