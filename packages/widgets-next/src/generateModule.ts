import * as fs from 'fs';
import * as path from 'path';

export function generateModule () {
  const base = process.cwd();
  const widgetsPath = path.resolve(base, '../widgets');

  const folders = fs.readdirSync(widgetsPath, { withFileTypes: true });

  let src = `const widgets = {}
const datasourceFetchers = {}
const parameterDefinitions = {}
`;

  folders.forEach(folder => {
    if (folder.isDirectory()) {
      const pkg = path.join(widgetsPath, folder.name, 'package.json');
      const { name, version, keywords, description } = require(pkg);
      const meta = { name, version, keywords, description };

      const quotedName = JSON.stringify(name);
      const visPath = JSON.stringify(path.join(name, 'visualization.ts'));
      const dataPath = JSON.stringify(path.join(name, 'datasource.json'));
      const paramsPath = JSON.stringify(path.join(name, 'params.json'));

      src += `widgets[${quotedName}] = () => import(${visPath}).then((module) => ({ ...${JSON.stringify(meta)}, ...module }))\n`;

      src += `datasourceFetchers[${quotedName}] = (ctx) => Promise.all([import(${dataPath}), import('@ossinsight/widgets-core/src/datasource')]).then(([jsonModule, core]) => core.default(jsonModule.default, ctx))\n`;

      src += `parameterDefinitions[${quotedName}] = () => import(${paramsPath}).then(module => module.default)\n`;
    }
  });

  src += 'export default widgets\n';
  src += 'export { datasourceFetchers, parameterDefinitions }\n';

  const filepath = path.resolve(base, 'node_modules/@ossinsight/widgets/index.js');
  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  fs.writeFileSync(filepath, src);
}