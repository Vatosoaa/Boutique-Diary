import StoreProductGrid from "@/components/store/StoreProductGrid";
import StoreFooter from "@/components/store/StoreFooter";
import StoreProductBanner from "@/components/store/StoreProductBanner";
import ScrollReveal from "@/components/store/ScrollReveal";
import { getProducts, getCategories } from "@/lib/store-data";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category as string | undefined;

  const categories = await getCategories();

  let categoryId: number | undefined;

  if (categoryParam) {
    const parsedId = parseInt(categoryParam, 10);
    if (!isNaN(parsedId)) {
      categoryId = parsedId;
    } else {
      const found = categories.find(
        c =>
          c.slug.toLowerCase() === categoryParam.toLowerCase() ||
          c.name.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (found) {
        categoryId = found.id;
      }
    }
  }

  const products = await getProducts({ categoryId });

  const currentCategory = categoryId
    ? categories.find(c => c.id === categoryId)
    : null;

  let bannerImage = "/images/banner.jpg";
  let bannerVariant:
    | "indigo"
    | "rose"
    | "amber"
    | "cyan"
    | "emerald"
    | "theme" = "indigo";

  if (currentCategory) {
    const slug = currentCategory.slug.toLowerCase();

    // Images par défaut
    const defaultImages: Record<string, string> = {
      femmes: "/images/banner-femme.jpg",
      hommes: "/images/banner-homme.jpg",
      enfants: "/images/banner-enfant.jpg",
      accessoires: "/images/accessoir.jpg",
    };
    if (defaultImages[slug]) {
      bannerImage = defaultImages[slug];
    }

    // Variantes de couleurs inspirées du fonctionnement du Blog
    const defaultVariants: Record<
      string,
      "indigo" | "rose" | "amber" | "cyan" | "emerald" | "theme"
    > = {
      femmes: "rose",
      hommes: "theme",
      enfants: "cyan",
      accessoires: "amber",
    };
    if (defaultVariants[slug]) {
      bannerVariant = defaultVariants[slug];
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {currentCategory ? (
        // Style "Blog" : Bannière dans un conteneur et avec ses marges arrondies spécifiques
        <div className="pt-4 pb-4 px-4 md:px-6 max-w-[1400px] mx-auto">
          <StoreProductBanner
            title={currentCategory.name}
            subtitle={`Plongez dans notre univers ${currentCategory.name}. Une sélection rigoureuse alliant savoir-faire et design contemporain.`}
            badge="Collection"
            variant={bannerVariant}
            enableTypewriter={true}
            image={bannerImage}
          />
        </div>
      ) : (
        // Page d'accueil du shop : Style "Blog" (contenu margé et arrondi)
        <div className="pt-4 pb-4 px-4 md:px-6 max-w-[1400px] mx-auto">
          <StoreProductBanner
            title="Toute la Boutique"
            subtitle="Explorez l'intégralité de nos collections. Des produits d'exception conçus pour durer et sublimer votre quotidien."
            badge="Catalogue"
            variant="indigo"
            enableTypewriter={true}
            image={bannerImage}
          />
        </div>
      )}

      <div className="pt-8 pb-16 px-4 md:px-6 max-w-[1400px] mx-auto">
        <ScrollReveal
          animation="fade-up"
          stagger={50}
          selector=".product-card-reveal"
        >
          <StoreProductGrid
            products={products}
            showTitle={false}
            showFooter={false}
          />
        </ScrollReveal>
      </div>
      <StoreFooter />
    </div>
  );
}
