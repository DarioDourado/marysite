export const queryKeys = {
  cms: {
    public: ['cms', 'public'] as const,
    adminPage: (slug: string) => ['cms', 'admin', slug] as const,
    adminPages: ['cms', 'admin'] as const,
  },
  media: {
    all: ['media'] as const,
    list: (q: string) => ['media', 'list', q] as const,
  },
  submissions: {
    all: ['submissions'] as const,
    list: (kind: string, status: string, q: string) => ['submissions', 'list', kind, status, q] as const,
    count: ['submissions', 'count'] as const,
  },
  users: {
    all: ['users'] as const,
  },
};
