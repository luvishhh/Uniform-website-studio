import ProductsPage from "../page";

export default function HealthcareWearPage({ searchParams }: { searchParams?: { search?: string; sort?: string; } }) {
  const healthcareCategorySearchParams = { ...searchParams, category: "healthcare" };
  return <ProductsPage searchParams={healthcareCategorySearchParams} />;
}
