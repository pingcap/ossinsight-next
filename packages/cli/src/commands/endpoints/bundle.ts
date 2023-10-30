import {Command} from "commander";
import * as fs from "fs";
import {glob} from "glob";
import {Liquid} from "liquidjs";
import * as path from "path";
import pino from "pino";
import Logger = pino.Logger;

const renderer = new Liquid();

export function initEndpointsBundleCommand(parentCommand: Command, logger: Logger) {
  parentCommand
    .command('bundle')
    .description('Bundle the endpoints\' config into one file.')
    .requiredOption<string>(
      '-e, --endpoints-dir <string>',
      'Specifies the directory to load the endpoint configs.',
      (value) => value,
      path.resolve(process.cwd(), '../../web/configs/endpoints')
    )
    .requiredOption<string>(
      '-t, --template-file <string>',
      'Specifies the template file of entry code.',
      (value) => value,
      path.resolve(process.cwd(), '../../web/templates/endpoints.ts.liquid')
    )
    .requiredOption<string>(
      '-o, --output-path <string>',
      'Specifies the output path to save the entry code.',
      (value) => value,
      path.resolve(process.cwd(), '../../web/app/api/queries/[...query]/endpoints.ts')
    )
    .action(async ({ endpointsDir, outputPath, templateFile  }) => {
      // Check if the endpoints directory exists.
      if (!fs.existsSync(endpointsDir)) {
        logger.error(`The endpoints config directory "${endpointsDir}" does not exist, please check the --endpoints-dir argument.`);
        return;
      }
      const endpointBaseDir = path.isAbsolute(endpointsDir) ? endpointsDir : path.resolve(process.cwd(), endpointsDir);

      // Check if the functions directory exists.
      if (!fs.existsSync(outputPath)) {
        logger.error(`The function code directory "${outputPath}" does not exist, please check the --output-path argument.`);
        return;
      }

      // Check if the template file exists.
      if (!fs.existsSync(templateFile)) {
        logger.error(`The template file (${templateFile}) of edge/serverless function, please check the --template-file argument.`);
        return;
      }
      const templateFilePath = path.isAbsolute(templateFile) ? templateFile : path.resolve(process.cwd(), templateFile);

      // Load function template.
      const functionTemplate = fs.readFileSync(templateFilePath, 'utf-8');

      // Traverse the endpoint config directory.
      const endpointJSONFiles = await glob('**/params.json', {
        cwd: endpointBaseDir,
      });
      const queries: Record<string, any>[] = [];
      for (const endpointJSONFile of endpointJSONFiles) {
        // Read endpoint config.
        const configPath = path.resolve(endpointBaseDir, endpointJSONFile);
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        // Read endpoint SQL.
        const endpointDir = path.dirname(endpointJSONFile);
        const sqlPath = path.resolve(endpointBaseDir, endpointDir, 'template.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        queries.push({
          name: endpointDir,
          templateSQL: sql,
          endpointConfig: config
        });
      }

      queries.sort((a, b) => a.name.localeCompare(b.name));

      // Generate function code.
      const entryCode = await renderer.parseAndRender(functionTemplate, {
        queries,
      });
      fs.writeFileSync(outputPath, entryCode);
    })
}
