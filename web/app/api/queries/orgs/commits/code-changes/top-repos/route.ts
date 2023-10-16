import {DataService} from "@ossinsight/data-api";
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
}

export const templateSQL = `
WITH repos AS (
    SELECT gr.repo_id, gr.repo_name
    FROM github_repos gr
    WHERE
        gr.owner_id = {{ownerId}}
        {% if repoIds.size > 0 %}
        AND gr.repo_id IN ({{ repoIds | join: ',' }})
        {% endif %}
), line_of_changes_per_repo AS (
    SELECT
        repo_id,
        SUM(additions) AS additions,
        SUM(deletions) AS deletions,
        SUM(additions + deletions) AS changes
    FROM github_events ge
    WHERE
        repo_id IN (SELECT repo_id FROM repos)
        AND type = 'PullRequestEvent'
        AND action = 'closed'
        AND pr_merged = 1
        {% if excludeBots %}
        -- Exclude bot users.
        AND ge.actor_login NOT LIKE '%bot%'
        {% endif %}
        {% case period %}
            {% when 'past_7_days' %} AND created_at > (CURRENT_DATE() - INTERVAL 14 DAY)
            {% when 'past_28_days' %} AND created_at > (CURRENT_DATE() - INTERVAL 56 DAY)
            {% when 'past_90_days' %} AND created_at > (CURRENT_DATE() - INTERVAL 180 DAY)
            {% when 'past_12_months' %} AND created_at > (CURRENT_DATE() - INTERVAL 24 MONTH)
        {% endcase %}
    GROUP BY repo_id
    ORDER BY changes DESC
    LIMIT {{n}}
)
SELECT
    r.repo_id,
    r.repo_name,
    loc.additions,
    loc.deletions,
    loc.changes
FROM line_of_changes_per_repo loc
JOIN repos r ON r.repo_id = loc.repo_id
ORDER BY changes DESC
LIMIT {{n}}

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
            "enums": [
                5,
                10,
                20,
                30,
                40,
                50
            ],
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
