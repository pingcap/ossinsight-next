import {Config as TiDBConnectionConfig, connect, Connection, FullResult} from "@tidbcloud/serverless";
import {Liquid} from "liquidjs";
import {DateTime} from "luxon";
import {NextRequest} from "next/server";
import {
  EndpointConfig,
  ItemType as ParameterItemType,
  Params,
  Type as ParameterType
} from "./types/EndpointConfig.schema";

export type EndpointResult = Record<any, any>;

const BIG_NUMBER_TYPES = ['BIGINT', 'DECIMAL'];

export class DataService {
  private readonly tidb: Connection;
  private readonly templateEngine: Liquid;

  constructor(config: TiDBConnectionConfig) {
    this.tidb = connect(config);
    this.templateEngine = new Liquid();
  }

  async handleQueryEndpoint(
    req: NextRequest,
    templateSQL: string,
    endpointConfig: EndpointConfig
  ): Promise<EndpointResult> {
    const requestParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const queryParams = await this.prepareQueryContext(endpointConfig, requestParams);
    const sql = await this.templateEngine.parseAndRender(templateSQL, queryParams);

    const start = DateTime.now();
    const result = await this.tidb.execute(sql, null, {
      fullResult: true
    }) as FullResult;
    const end = DateTime.now();
    const duration = end.diff(start).as("seconds");

    return {
      params: queryParams,
      sql: result.statement,
      types: result.types,
      data: result.rows.map((row: Record<string, any>) => {
        return Object.fromEntries(Object.entries(row).map(([key, value]) => {
          if (BIG_NUMBER_TYPES.includes(result.types[key])) {
            return [key, Number(value)];
          }
          return [key, value];
        }));
      }),
      requestedAt: start.toISO(),
      finishedAt: end.toISO(),
      spent: duration,
      geo: req.geo,
    }
  }

  async prepareQueryContext(queryConfig: EndpointConfig, values: Record<string, any>) {
    let context: Record<string, any> = {};
    for (const param of queryConfig.params) {
      const value = values[param.name] ?? param.default;

      if (param.type === ParameterType.ARRAY) {
        const values = Array.isArray(value) ? value : [value];
        context[param.name] = values.map((itemValue: any) => {
          return this.verifyParamValue(param, itemValue);
        });
      } else {
        context[param.name] = this.verifyParamValue(param, value);
      }

    }
    return context;
  }

  verifyParamValue(param: Params, value: any) {
    const type = (param.type === ParameterType.ARRAY ? param.itemType : param.type) || ParameterType.STRING;
    let processedValue = value;
    switch (type) {
      case ParameterItemType.BOOLEAN:
        if (value === 'true') {
          processedValue = true;
        } else if (value === 'false') {
          processedValue = false;
        } else if (typeof value === 'boolean') {
          processedValue = value;
        } else {
          throw new APIError(`The parameter <${param.name}> is not a boolean.`);
        }
        break;
      case ParameterItemType.NUMBER:
        const num = Number(value);
        if (value === null || Number.isNaN(num)) {
          throw new APIError(`The parameter <${param.name}> is not a number.`);
        }
        processedValue = num;
        break;
      case ParameterItemType.INTEGER:
        const int = Number(value);
        if (value === null || Number.isNaN(int) || !Number.isInteger(int)) {
          throw new APIError(`The parameter <${param.name}> is not an integer.`);
        }
        processedValue = int;
        break;
      case ParameterItemType.STRING:
        if (param.pattern) {
          const regex = new RegExp(param.pattern);
          if (!regex.test(value)) {
            throw new APIError(`The parameter <${param.name}> does not match the pattern "${param.pattern}".`);
          }
        }
        break;
      default:
        throw new APIError(`The parameter <${param.name}> has an unknown type.`);
    }

    if (Array.isArray(param.enums) && !param.enums.includes(processedValue)) {
      throw new APIError(`The parameter <${param.name}> is not in the enums.`);
    }

    return processedValue;
  }

}

export class APIError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
  }
}