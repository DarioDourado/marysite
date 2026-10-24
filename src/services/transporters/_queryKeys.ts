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
  users: {
    all: ['users'] as const,
  },
};
