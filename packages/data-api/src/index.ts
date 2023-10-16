import {Config as TiDBConnectionConfig, connect, Connection, FullResult} from "@tidbcloud/serverless";
import {Liquid} from "liquidjs";
import {DateTime} from "luxon";
import {NextRequest} from "next/server";
import {EndpointConfig} from "./types/EndpointConfig.schema";

export type EndpointResult = Record<any, any>;

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
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const sql = await this.templateEngine.parseAndRender(templateSQL, params);

    const start = DateTime.now();
    const result = await this.tidb.execute(sql, null, {
      fullResult: true
    }) as FullResult;
    const end = DateTime.now();
    const duration = end.diff(start).as("seconds");

    return {
      params: params,
      sql: result.statement,
      data: result.rows,
      requestedAt: start.toISO(),
      finishedAt: end.toISO(),
      spent: duration
    }
  }

}