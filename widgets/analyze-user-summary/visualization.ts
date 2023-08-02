import type { WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { createElement } from 'react';
import Component from './Component';

type Params = { activity: string, collection_id: string }
export type PersonalOverview = {
  code_additions: number
  code_deletions: number
  code_reviews: number
  contribute_repos: number
  issues: number
  pull_requests: number
  repos: number
  star_earned: number
  star_repos: number
  user_id: number
}
export type Input = [PersonalOverview]

export default function (input: Input, ctx: WidgetVisualizerContext<Params>) {
  return createElement(Component, { input, ctx });
}

export const type = 'react-html';
