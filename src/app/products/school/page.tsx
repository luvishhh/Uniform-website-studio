import ProductsPage from "../page";

export default function SchoolUniformsPage({ searchParams }: { searchParams?: { search?: string; sort?: string; } }) {
  const schoolCategorySearchParams = { ...searchParams, category: "school" };
  return <ProductsPage searchParams={schoolCategorySearchParams} />;
}
