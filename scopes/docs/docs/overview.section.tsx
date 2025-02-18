import { Section } from '@teambit/component';
import React from 'react';

import { DocsUI } from './docs.ui.runtime';
import { Overview } from './overview';

export class OverviewSection implements Section {
  constructor(
    /**
     * docs ui extension.
     */
    private docs: DocsUI
  ) {}

  navigationLink = {
    href: '.',
    exact: true,
    children: 'Overview',
  };

  route = {
    index: true,
    element: <Overview titleBadges={this.docs.titleBadgeSlot} />,
  };

  order = 10;
}
