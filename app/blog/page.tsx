import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Header from "../components/Header";
import { getPosts } from "@/lib/posts";
import Footer from "../components/Footer";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors mb-8"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          <span>Back</span>
        </Link>

        <section>
          <div className="mb-8">
            <h1 className="text-xl font-medium tracking-tight">Writing</h1>
            <p className="text-muted text-sm mt-1">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          <div className="space-y-0">
            {posts.map((post) => (
              <article key={post.id} className="border-b last:border-b-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-medium group-hover:opacity-70 transition-opacity">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-muted">
                        <div className="flex items-center gap-1">
                          <Clock size={10} strokeWidth={1.5} />
                          <span className="text-xs">{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={10} strokeWidth={1.5} />
                          <span className="text-xs">{post.readingTime} min read</span>
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={10} strokeWidth={1.5} />
                            <span className="text-xs">{post.tags.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </div>
                  <p className="text-muted text-xs mt-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
