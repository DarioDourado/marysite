import { useBlogHook } from './useBlogHook.ts';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { useSeo } from '@/src/hooks/cms/index.ts';

export const Blog = () => {
  const { t, posts, loading, error } = useBlogHook();
  useSeo('blog');

  return (
    <section className="pt-12 md:pt-14 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
            <Cms k="blog.title" />
          </h1>
          <p className="text-lg md:text-xl text-text-light leading-relaxed"><Cms k="blog.intro" /></p>
        </div>

        {loading && (
          <p className="text-center text-text-light" role="status"><Cms k="blog.loading" /></p>
        )}

        {error && (
          <p className="text-center text-danger" role="alert"><Cms k="blog.error" /></p>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="max-w-2xl mx-auto text-center bg-primary/20 rounded-card p-10 text-text-light text-lg">
            <Cms k="blog.empty" />
          </div>
        )}

        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <FadeIn
                key={post.id}
                delay={index * 0.05}
                className="bg-secondary/20 rounded-card p-8 md:p-10"
              >
                <time className="text-xs uppercase tracking-widest text-primary-dark">{post.date}</time>
                <h2 className="text-xl md:text-2xl font-serif font-normal text-foreground mt-3 mb-4">{post.title}</h2>
                <p className="text-text-light leading-relaxed">{post.excerpt}</p>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
