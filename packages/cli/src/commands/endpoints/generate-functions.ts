import type {EndpointConfig} from "@ossinsight/data-api/src/types/EndpointConfig.schema";
import {Command} from "commander";
import * as fs from "fs";
import {glob} from "glob";
import {Liquid} from "liquidjs";
import * as path from "path";
import pino from "pino";
import Logger = pino.Logger;

const renderer = new Liquid();

export function initEndpointsGenerateCommand(parentCommand: Command, logger: Logger) {
  parentCommand
    .command('generate')
    .description('Generate edge functions based on the endpoints config.')
    .requiredOption<string>(
      '-c, --endpoints-dir <string>',
      'Specifies the directory to get the endpoint configs.',
      (value) => value,
      path.resolve(process.cwd(), '../../configs/endpoints')
    )
    .requiredOption<string>(
      '-f, --functions-dir <string>',
      'Specifies the target directory to store the generated edge/severless functions.',
      (value) => value,
      path.resolve(process.cwd(), '../../web/app/api/queries')
    )
    .requiredOption<string>(
      '-t, --template-file <string>',
      'Specifies the template file of edge/serverless function.',
      (value) => value,
      path.resolve(process.cwd(), '../../configs/templates/route.ts.liquid')
    )
    .action(async ({ endpointsDir, functionsDir, templateFile  }) => {
      // Check if the endpoints directory exists.
      if (!fs.existsSync(endpointsDir)) {
        logger.error(`The endpoints config directory "${endpointsDir}" does not exist, please check the --endpoints-dir option.`);
        return;
      }
      const endpointBaseDir = path.isAbsolute(endpointsDir) ? endpointsDir : path.resolve(process.cwd(), endpointsDir);

      // Check if the functions directory exists.
      if (!fs.existsSync(functionsDir)) {
        logger.error(`The function code directory "${functionsDir}" does not exist, please check the --functions-dir option.`);
        return;
      }
      const functionBaseDir = path.isAbsolute(functionsDir) ? functionsDir : path.resolve(process.cwd(), functionsDir);

      // Check if the template file exists.
      if (!fs.existsSync(templateFile)) {
        logger.error(`The template file (${templateFile}) of edge/serverless function, please check the --template-file option.`);
        return;
      }
      const templateFilePath = path.isAbsolute(templateFile) ? templateFile : path.resolve(process.cwd(), templateFile);

      // Load function template.
      const template = fs.readFileSync(templateFilePath, 'utf-8');

      // Traverse the endpoint config directory.
      const endpointJSONFiles = await glob('**/params.json', {
        cwd: endpointBaseDir,
      });
      for (const endpointJSONFile of endpointJSONFiles) {
        // Read endpoint config.
        const configPath = path.resolve(endpointBaseDir, endpointJSONFile);
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        // Read endpoint SQL.
        const endpointDir = path.dirname(endpointJSONFile);
        const sqlPath = path.resolve(endpointBaseDir, endpointDir, 'template.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        // Create function directory.
        const targetFunctionDir = path.resolve(functionBaseDir, endpointDir);
        fs.mkdirSync(targetFunctionDir, { recursive: true });

        // Generate function code.
        const functionCode = await generateFunctionCode(template, config, sql);
        const functionFilePath = path.resolve(targetFunctionDir, 'route.ts');
        fs.writeFileSync(functionFilePath, functionCode);
      }
    })
}

export async function generateFunctionCode(
  template: string,
  endpointConfig: EndpointConfig,
  templateSQL: string
): Promise<string> {
  return await renderer.parseAndRender(template, {
    templateSQL: templateSQL.replace(/`/g, '\\`'),
    endpointConfig: JSON.stringify(endpointConfig, null, 4)
  });
}
