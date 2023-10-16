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
), reviews_by_repo AS (
    SELECT
        repo_id, COUNT(*) AS reviews
    FROM github_events ge
    WHERE
        ge.repo_id IN (SELECT repo_id FROM repos)
        AND ge.type = 'PullRequestReviewEvent'
        AND ge.action = 'created'
        {% if excludeBots %}
        -- Exclude bot users.
        AND ge.actor_login NOT LIKE '%bot%'
        {% endif %}
        {% case period %}
            {% when 'past_7_days' %} AND created_at > (NOW() - INTERVAL 7 DAY)
            {% when 'past_28_days' %} AND created_at > (NOW() - INTERVAL 28 DAY)
            {% when 'past_90_days' %} AND created_at > (NOW() - INTERVAL 90 DAY)
            {% when 'past_12_months' %} AND created_at > (NOW() - INTERVAL 12 MONTH)
        {% endcase %}
    GROUP BY repo_id
), review_comments_by_repo AS (
    SELECT
        repo_id, COUNT(*) AS review_comments
    FROM github_events ge
    WHERE
        ge.repo_id IN (SELECT repo_id FROM repos)
        AND ge.type = 'PullRequestReviewCommentEvent'
        AND ge.action = 'created'
        {% if excludeBots %}
        -- Exclude bot users.
        AND ge.actor_login NOT LIKE '%bot%'
        {% endif %}
        {% case period %}
            {% when 'past_7_days' %} AND created_at > (NOW() - INTERVAL 7 DAY)
            {% when 'past_28_days' %} AND created_at > (NOW() - INTERVAL 28 DAY)
            {% when 'past_90_days' %} AND created_at > (NOW() - INTERVAL 90 DAY)
            {% when 'past_12_months' %} AND created_at > (NOW() - INTERVAL 12 MONTH)
        {% endcase %}
    GROUP BY repo_id
)
SELECT
    r.repo_id,
    r.repo_name,
    rbr.reviews AS reviews,
    rcbr.review_comments AS review_comments,
    ROUND(rcbr.review_comments / rbr.reviews, 2) AS comments_per_review
FROM repos r
JOIN reviews_by_repo rbr ON rbr.repo_id = r.repo_id
JOIN review_comments_by_repo rcbr ON rcbr.repo_id = r.repo_id
ORDER BY comments_per_review DESC
LIMIT {{ n }}
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
