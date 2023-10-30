import {Command} from "commander"
import { logger } from './logger'
import {initEndpointsBundleCommand} from "./commands/endpoints/bundle"

async function main() {
  const program = new Command()
  program.name('OSSInsight CLI')
    .description('OSSInsight CLI')
    .version('0.0.1');

  const endpointsCommand = program.command('endpoints')
  initEndpointsBundleCommand(endpointsCommand, logger)

  program.parse();
}

void main();