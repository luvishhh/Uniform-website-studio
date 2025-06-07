
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockCategories, mockProducts } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Shirt, Zap, Gift } from "lucide-react"; // Updated icons

export default function HomePage() {
  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 4);
  const schoolCategory = mockCategories.find(cat => cat.slug === 'school-college');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 lg:py-40 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-6 leading-tight">
                Smart Uniforms, Brighter Futures.
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-10 text-primary-foreground/90 max-w-xl mx-auto md:mx-0">
                Outfit your students for success with our range of high-quality, comfortable, and durable school uniforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-7 rounded-md shadow-lg transition-transform hover:scale-105" asChild>
                  <Link href="/products">
                    Shop All Uniforms <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-md border-primary-foreground/50 hover:bg-primary-foreground/10 transition-colors" asChild>
                  <Link href="/donate">
                    Donate Uniforms
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://placehold.co/800x600.png" 
                  alt="Students in UniShop uniforms"
                  layout="fill"
                  objectFit="cover"
                  priority
                  data-ai-hint="students smiling"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-16">Why UniShop?</h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <ShoppingBag className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-headline mb-2">Quality First</h3>
                <p className="text-muted-foreground text-sm">Durable materials and comfortable designs that last the school year.</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <Shirt className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-headline mb-2">Perfect Fit</h3>
                <p className="text-muted-foreground text-sm">Wide range of sizes and styles for all students, ensuring a smart look.</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-headline mb-2">Easy Shopping</h3>
                <p className="text-muted-foreground text-sm">User-friendly online store with secure and fast checkout.</p>
              </div>
            </div>
          </div>
        </section>

        {/* School & College Category Section */}
        {schoolCategory && (
          <section className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">{schoolCategory.name}</h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{schoolCategory.description}</p>
              <div className="grid grid-cols-1 gap-8 md:gap-10">
                 {/* Pass the single category directly */}
                <CategoryCard category={schoolCategory} />
              </div>
            </div>
          </section>
        )}
        

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Featured Uniforms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-16">
                <Button variant="outline" size="lg" className="text-base px-8 py-3" asChild>
                  <Link href="/products">
                    Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Donation Call to Action */}
        <section className="py-16 md:py-24 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
             <Gift className="h-16 w-16 mx-auto mb-6 text-accent-foreground/80" />
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Give Back with UniShop</h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto text-accent-foreground/90">
              Join our mission to support students in need. Your old uniforms can make a big difference.
            </p>
            <Button size="lg" variant="outline" className="bg-background text-accent border-background hover:bg-background/90 text-lg px-10 py-7 rounded-md shadow-lg transition-transform hover:scale-105" asChild>
              <Link href="/donate">
                Learn About Donations
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
