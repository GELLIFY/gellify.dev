import { DocsLayout, DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

const layoutProps: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  sidebar: {
    hideSearch: false,
    collapsible: true,
    tabs: [
      {
        title: "Template v2",
        description: "The latest version",
        url: "/docs/v2",
        icon: <img
        src="https://raw.githubusercontent.com/colinhacks/zod/3782fe29920c311984004c350b9fefaf0ae4c54a/logo.svg"
        alt="Zod 3"
        className="h-6"
      />,
      },
      {
        title: "Template v1",
        description: "Deprecated",
        url: "/docs/v1",
        icon: (
          <img
            src="https://raw.githubusercontent.com/colinhacks/zod/3782fe29920c311984004c350b9fefaf0ae4c54a/logo.svg"
            alt="Zod 3"
            className="h-6"
          />
        ),
      },
    ],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout {...layoutProps} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
