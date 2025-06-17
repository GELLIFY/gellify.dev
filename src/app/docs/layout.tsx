import { DocsLayout, DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

const layoutProps: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  sidebar: {
    collapsible: true,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...layoutProps} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
