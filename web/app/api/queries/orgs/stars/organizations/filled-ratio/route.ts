import {DataService} from "@ossinsight/data-api";
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
}

export const templateSQL = `
WITH repos AS (
    SELECT
        gr.repo_id, gr.repo_name
    FROM github_repos gr
    WHERE
        gr.owner_id = {{ownerId}}
        {% if repoIds.size > 0 %}
        AND gr.repo_id IN ({{ repoIds | join: ',' }})
        {% endif %}
), stars_overview AS (
    SELECT
        SUM(IF(gu.organization_formatted IS NOT NULL AND LENGTH(gu.organization_formatted) != 0, 1, 0)) AS stars_with_org,
        COUNT(*) AS stars_total
    FROM github_events ge
    JOIN github_users gu ON ge.actor_login = gu.login
    WHERE
        ge.repo_id IN (SELECT repo_id FROM repos)
        AND ge.type = 'WatchEvent'
        AND ge.action = 'started'
        {% if excludeBots %}
        -- Exclude bot users.
        AND ge.actor_login NOT LIKE '%bot%'
        {% endif %}
        {% case period %}
            {% when 'past_7_days' %} AND ge.created_at > (NOW() - INTERVAL 7 DAY)
            {% when 'past_28_days' %} AND ge.created_at > (NOW() - INTERVAL 28 DAY)
            {% when 'past_90_days' %} AND ge.created_at > (NOW() - INTERVAL 90 DAY)
            {% when 'past_12_months' %} AND ge.created_at > (NOW() - INTERVAL 12 MONTH)
        {% endcase %}
)
SELECT
    ROUND(so.stars_with_org / so.stars_total * 100, 2) AS percentage
FROM
    stars_overview so

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
            "name": "n",
            "type": "integer",
            "default": 10
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
