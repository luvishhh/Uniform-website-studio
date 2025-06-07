import ProductsPage from "../page";

export default function CorporateAttirePage({ searchParams }: { searchParams?: { search?: string; sort?: string; } }) {
  const corporateCategorySearchParams = { ...searchParams, category: "corporate" };
  return <ProductsPage searchParams={corporateCategorySearchParams} />;
}
