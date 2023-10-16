import {DataService} from "@ossinsight/data-api";
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
}

export const templateSQL = `
WITH repos AS (
    SELECT gr.repo_id
    FROM github_repos gr
    WHERE
        gr.owner_id = {{ownerId}}
        {% if repoIds.size > 0 %}
        AND gr.repo_id IN ({{ repoIds | join: ',' }})
        {% endif %}
), opened_issues_by_period AS (
     SELECT
         {% case period %}
             {% when 'past_7_days' %} TIMESTAMPDIFF(DAY, created_at, NOW()) DIV 7
             {% when 'past_28_days' %} TIMESTAMPDIFF(DAY, created_at, NOW()) DIV 28
             {% when 'past_90_days' %} TIMESTAMPDIFF(DAY, created_at, NOW()) DIV 90
             {% when 'past_12_months' %}  TIMESTAMPDIFF(MONTH, created_at, NOW()) DIV 12
         {% endcase %} AS period,
         COUNT(*) AS issues
     FROM github_events ge
     WHERE
        ge.repo_id IN (SELECT repo_id FROM repos)
        AND ge.type = 'IssuesEvent'
        AND ge.action = 'opened'
        {% if excludeBots %}
        -- Exclude bot users.
        AND ge.actor_login NOT LIKE '%bot%'
        {% endif %}
        {% case period %}
            {% when 'past_7_days' %} AND ge.created_at > (NOW() - INTERVAL 14 DAY)
            {% when 'past_28_days' %} AND ge.created_at > (NOW() - INTERVAL 56 DAY)
            {% when 'past_90_days' %} AND ge.created_at > (NOW() - INTERVAL 180 DAY)
            {% when 'past_12_months' %} AND ge.created_at > (NOW() - INTERVAL 24 MONTH)
        {% endcase %}
    GROUP BY period
), current_period_issues AS (
    SELECT issues FROM opened_issues_by_period WHERE period = 0
), past_period_issues AS (
    SELECT issues FROM opened_issues_by_period WHERE period = 1
)
SELECT
    IFNULL(cpp.issues, 0) AS current_period_total,
    IFNULL(ppp.issues, 0) AS past_period_total,
    ROUND((cpp.issues - ppp.issues) / ppp.issues * 100, 2) AS growth_percentage
FROM current_period_issues cpp
LEFT JOIN past_period_issues ppp ON 1 = 1
;


`

export const endpointConfig = {
    "cacheHours": 1,
    "engine": "liquid",
    "cacheProvider": "NORMAL_TABLE",
    "params": [
        {
            "name": "ownerId",
            "replaces": "11855343",
            "type": "integer"
        },
        {
            "name": "repoIds",
            "replaces": "41986369",
            "type": "array",
            "default": [],
            "itemType": "integer",
            "maxArrayLength": 50
        },
        {
            "name": "period",
            "type": "string",
            "enums": [
                "past_7_days",
                "past_28_days",
                "past_90_days",
                "past_12_months"
            ],
            "default": "past_28_days"
        },
        {
            "name": "excludeBots",
            "type": "boolean",
            "default": true
        }
    ]
}

const dataService = new DataService({
  url: process.env.DATABASE_URL
});

export async function GET(req: NextRequest) {
  const result = await dataService.handleQueryEndpoint(req, templateSQL, endpointConfig);
  return NextResponse.json(result);
}
