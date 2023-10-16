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
), participants_per_country AS (
    SELECT
        gu.country_code,
        COUNT(DISTINCT actor_login) AS participants
    FROM github_events ge
    JOIN github_users gu ON ge.actor_login = gu.login
    WHERE
        ge.repo_id IN (SELECT repo_id FROM repos)
        {% case role %}
        {% when 'pr_creators' %}
        AND ge.type = 'PullRequestEvent' AND ge.action = 'opened'
        {% when 'pr_reviewers' %}
        AND ge.type = 'PullRequestReviewEvent' AND ge.action = 'created'
        {% when 'issue_creators' %}
        AND ge.type = 'IssuesEvent' AND ge.action = 'opened'
        {% when 'commit_authors' %}
        AND ge.type = 'PushEvent' AND ge.action = ''
        {% when 'pr_commenters' %}
        AND ge.type = 'IssueCommentEvent' AND ge.action = 'created'
        AND EXISTS (
            SELECT 1
            FROM github_events ge2
            WHERE
                ge2.type = 'PullRequestEvent'
                AND ge2.action = 'opened'
                AND ge2.created_at < ge.created_at
                AND ge2.repo_id = ge.repo_id
                AND ge2.number = ge.number
            )
        {% when 'issue_commenters' %}
        AND ge.type = 'IssueCommentEvent' AND ge.action = 'created'
        AND EXISTS (
            SELECT 1
            FROM github_events ge2
            WHERE
                ge2.type = 'IssuesEvent'
                AND ge2.action = 'opened'
                AND ge2.created_at < ge.created_at
                AND ge2.repo_id = ge.repo_id
                AND ge2.number = ge.number
            )
        {% else %}
        -- Events considered as participation (Exclude \`WatchEvent\`, which means star a repo).
        AND ge.type IN ('IssueCommentEvent',  'DeleteEvent',  'CommitCommentEvent',  'MemberEvent',  'PushEvent',  'PublicEvent',  'ForkEvent',  'ReleaseEvent',  'PullRequestReviewEvent',  'CreateEvent',  'GollumEvent',  'PullRequestEvent',  'IssuesEvent',  'PullRequestReviewCommentEvent')
        AND ge.action IN ('added', 'published', 'reopened', 'closed', 'created', 'opened', '')
        {% endcase %}
        {% if excludeBots %}
        -- Exclude bot users.
        AND LOWER(ge.actor_login) NOT LIKE '%bot%'
        AND ge.actor_login NOT IN (SELECT login FROM blacklist_users LIMIT 255)
        {% endif %}
        {% if excludeUnknown %}
        -- Exclude users with no country code.
        AND gu.country_code NOT IN ('', 'N/A', 'UND')
        {% endif %}
        {% case period %}
        {% when 'past_7_days' %} AND ge.created_at > (NOW() - INTERVAL 7 DAY)
        {% when 'past_28_days' %} AND ge.created_at > (NOW() - INTERVAL 28 DAY)
        {% when 'past_90_days' %} AND ge.created_at > (NOW() - INTERVAL 90 DAY)
        {% when 'past_12_months' %} AND ge.created_at > (NOW() - INTERVAL 12 MONTH)
        {% endcase %}
    GROUP BY gu.country_code
), participants_total AS (
    SELECT SUM(participants) AS total FROM participants_per_country
)
SELECT
    ppc.country_code,
    ppc.participants,
    ROUND(ppc.participants / pt.total * 100, 2) AS percentage
FROM
    participants_per_country ppc,
    participants_total pt
ORDER BY ppc.participants DESC
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
            "name": "role",
            "type": "string",
            "enums": [
                "all",
                "pr_creators",
                "pr_commenters",
                "pr_reviewers",
                "issue_creators",
                "issue_commenters",
                "commit_authors"
            ],
            "default": "all"
        },
        {
            "name": "n",
            "type": "integer",
            "default": 50
        },
        {
            "name": "excludeBots",
            "type": "boolean",
            "default": true
        },
        {
            "name": "excludeUnknown",
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
