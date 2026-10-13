export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

/**
 * Transporter for blog posts.
 * Mocked until a CMS or content source is chosen; returns newest first.
 */
export const BlogTransporter = {
  async getPosts(): Promise<BlogPost[]> {
    return [];
  },
};
