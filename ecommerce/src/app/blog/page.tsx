import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Eye,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
} from "lucide-react";
import BlogListClient from "@/components/blog/BlogListClient";
import StoreProductBanner from "@/components/store/StoreProductBanner";
import { getStoreStats } from "@/lib/store-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog | Boutique Diary",
  description: "Découvrez nos articles sur la mode et nos conseils de style",
};

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

import { prisma } from "@/lib/prisma";

function estimateReadTime(text: string): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      take: 20,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        viewCount: true,
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            price: true,
            category: { select: { name: true } },
          },
        },
      },
    });

    return posts.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
    })) as unknown as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const [posts] = await Promise.all([getBlogPosts(), getStoreStats()]);
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="pt-4 pb-16 px-4 md:px-6 max-w-[1400px] mx-auto">
        <StoreProductBanner
          title="Le Journal Boutique Diary"
          subtitle="Explorez nos articles de style, découvrez les tendances et trouvez l'inspiration pour sublimer votre garde-robe."
          badge="BLOG & LIFESTYLE"
          variant="emerald"
          enableTypewriter={true}
        />

        {/* Section header */}
        <div className="mt-16 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-3 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Articles récents
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                L&apos;univers Boutique Diary
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Plongez dans nos articles, nos conseils de mode et nos
                inspirations quotidiennes pour affirmer votre style.
              </p>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <section className="py-32 px-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-3">
                Aucun article pour l&apos;instant
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Nos articles arrivent bientôt. En attendant, découvrez nos
                produits !
              </p>
              <Button asChild size="lg" className="rounded-full px-8 gap-2">
                <Link href="/produits">
                  Voir la boutique
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </section>
        ) : (
          <div className="space-y-16">
            {/* Featured Post */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block mb-12"
              >
                <article className="relative grid md:grid-cols-2 gap-0 bg-white dark:bg-gray-950 rounded-4xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-[#267b93]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#267b93]/10">
                  {/* Image */}
                  <div className="relative aspect-4/3 md:aspect-3/4 lg:aspect-auto lg:min-h-[500px] overflow-hidden">
                    {featuredPost.coverImage ? (
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={95}
                        className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                        <Sparkles className="w-20 h-20 text-gray-300" />
                      </div>
                    )}

                    {/* Featured badge */}
                    <div className="absolute top-6 left-6 z-10">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#3891a6] text-white shadow-sm border border-[#3891a6]/20">
                        <Sparkles className="w-3.5 h-3.5 text-[#f5a623]" />À la
                        une
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 md:p-14 lg:p-16 space-y-6 bg-[#fcfdfd] dark:bg-gray-950 relative">
                    {featuredPost.product.category && (
                      <div className="w-fit px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 capitalize tracking-wide shadow-sm">
                        {featuredPost.product.category.name}
                      </div>
                    )}

                    <h2 className="text-[clamp(1.75rem,3vw,3rem)] font-serif font-black text-[#267b93] dark:text-[#52b1cd] leading-[1.1] tracking-tight group-hover:text-[#1d6074] dark:group-hover:text-[#80c8df] transition-colors duration-300">
                      {featuredPost.title}
                    </h2>

                    {featuredPost.excerpt && (
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 text-base md:text-lg font-medium">
                        {featuredPost.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium pt-2">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {featuredPost.viewCount} vues
                      </span>
                      {featuredPost.excerpt && (
                        <span className="inline-flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {estimateReadTime(featuredPost.excerpt)} min
                        </span>
                      )}
                    </div>

                    <div className="pt-4">
                      <span className="inline-flex items-center gap-2 text-[#267b93] dark:text-[#52b1cd] font-bold group-hover:gap-3 transition-all duration-300">
                        Lire l&apos;article
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Other Posts */}
            <BlogListClient initialPosts={otherPosts} />
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Découvrez nos collections
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
                Trouvez les pièces parfaites pour compléter votre style et
                affirmer votre personnalité.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 h-13 text-base font-bold gap-2.5 shadow-lg shadow-primary/30"
              >
                <Link href="/produits">
                  Explorer la boutique
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
