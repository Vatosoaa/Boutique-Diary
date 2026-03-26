"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
  viewCount: number;
  product: {
    id: number;
    name: string;
    brand: string | null;
    price: number;
    category: { name: string } | null;
  };
}

interface BlogListProps {
  initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const currentOffset = posts.length + 1;

      const nextPosts = await fetch(
        `/api/blog?limit=${limit}&offset=${currentOffset}&excludeFeatured=true`,
      ).then(res => res.json());

      if (nextPosts.posts && nextPosts.posts.length > 0) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = nextPosts.posts.filter(
            (p: BlogPost) => !existingIds.has(p.id),
          );
          return [...prev, ...uniqueNewPosts];
        });
        if (nextPosts.posts.length < limit) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts", error);
    } finally {
      setLoading(false);
    }
  };

  if (posts.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-black text-foreground mb-8">
        Tous nos articles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    quality={85}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}

                {/* Category badge */}
                {post.product.category && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold backdrop-blur-sm bg-white/90 dark:bg-black/70 text-foreground shadow-sm"
                    >
                      {post.product.category.name}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.viewCount}
                    </span>
                  </div>
                  <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Lire
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="rounded-full px-8 gap-2 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                Voir plus d&apos;articles
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
