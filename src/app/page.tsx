
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// CategoryCard component is no longer directly used here for the main category display
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockCategories, mockProducts } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Shirt, Zap, Gift } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import LogoMarquee from "@/components/shared/LogoMarquee"; // Import the new component
import React from "react";

const carouselSlides = [
  {
    imageSrc: "https://placehold.co/1920x1080.png",
    imageAlt: "Students in high-quality UniShop uniforms",
    "data-ai-hint": "students group modern",
  },
  {
    imageSrc: "https://placehold.co/1920x1080.png",
    imageAlt: "Close-up of UniShop uniform fabric",
    "data-ai-hint": "fabric texture close-up",
  },
  {
    imageSrc: "https://placehold.co/1920x1080.png",
    imageAlt: "UniShop donation program visual",
    "data-ai-hint": "uniforms donation drive",
  },
];


export default function HomePage() {
  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 3); // Show only 3 featured products
  const schoolCategory = mockCategories.find(cat => cat.slug === 'school');
  const collegeCategory = mockCategories.find(cat => cat.slug === 'college');
  const autoplayPlugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }));


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - New Design with Static Text Overlay */}
        <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden group">
          {/* Background Carousel */}
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplayPlugin.current]}
            className="absolute inset-0 w-full h-full z-0"
          >
            <CarouselContent>
              {carouselSlides.map((slide, index) => (
                <CarouselItem key={index} className="relative w-full h-full">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={slide['data-ai-hint']}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none"></div> {/* Darkening Overlay for contrast */}
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <CarouselPrevious className="bg-background/70 hover:bg-background text-foreground border-border hover:border-primary h-10 w-10 md:h-12 md:w-12" />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <CarouselNext className="bg-background/70 hover:bg-background text-foreground border-border hover:border-primary h-10 w-10 md:h-12 md:w-12" />
            </div>
            <CarouselDots className="absolute bottom-6 md:bottom-8 z-20"/>
          </Carousel>

          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 md:p-16 text-center text-white z-10 pointer-events-none">
            <div className="max-w-xl md:max-w-2xl lg:max-w-3xl bg-black/60 backdrop-blur-lg p-8 md:p-10 rounded-xl shadow-2xl pointer-events-auto border border-white/10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline mb-6 leading-tight md:leading-snug">
                Dress for Success. Discover UniShop.
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-95">
                Premium quality school, corporate, and healthcare uniforms designed for comfort and durability.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 px-10 py-4 text-lg"
                asChild
              >
                <Link href="/products" className="flex items-center">
                  Shop All Collections <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Logo Marquee Section */}
        <section className="py-8 md:py-12 bg-background border-y border-border/60">
          <div className="container mx-auto px-4 md:px-6 text-center mb-6 md:mb-8">
            <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
              Trusted by Leading Schools & Colleges
            </h2>
          </div>
          <LogoMarquee />
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-4">Why <span className="text-primary">UniShop</span>?</h2>
            <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Your trusted partner for quality, convenience, and community.</p>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 text-center">
              {[
                { icon: ShoppingBag, title: "Quality First", description: "Durable materials and comfortable designs that last." },
                { icon: Shirt, title: "Perfect Fit", description: "Wide range of sizes and styles for a smart, professional look." },
                { icon: Zap, title: "Easy Shopping", description: "User-friendly online store with secure and fast checkout." },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center p-6 md:p-8 bg-card rounded-xl shadow-lg border border-transparent hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <item.icon className="h-14 w-14 text-primary mb-5" />
                  <h3 className="text-2xl font-semibold font-headline mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section - New Alternating Full-Width Layout */}
        <section className="bg-background">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-16">Our Uniform Categories</h2>
            
            {schoolCategory && (
              <div className="mb-16 md:mb-24 group">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl order-1">
                    <Image
                      src={schoolCategory.imageUrl}
                      alt={schoolCategory.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      data-ai-hint={schoolCategory['data-ai-hint']}
                    />
                     <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent md:bg-gradient-to-t md:from-black/30 md:via-transparent md:to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  </div>
                  <div className="flex flex-col justify-center items-start order-2 text-left md:pl-8">
                    <h3 className="text-3xl lg:text-4xl font-bold font-headline text-foreground group-hover:text-primary transition-colors mb-4">
                      {schoolCategory.name} Uniforms
                    </h3>
                    <p className="text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
                      {schoolCategory.description}
                    </p>
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors text-base px-8 py-3 rounded-md shadow-md group-hover:shadow-lg"
                      asChild
                    >
                      <Link href={`/products?category=${schoolCategory.slug}`}>
                        Shop School Uniforms <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {collegeCategory && (
              <div className="group">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="flex flex-col justify-center items-start order-2 md:order-1 text-left md:pr-8">
                    <h3 className="text-3xl lg:text-4xl font-bold font-headline text-foreground group-hover:text-primary transition-colors mb-4">
                      {collegeCategory.name} Uniforms
                    </h3>
                    <p className="text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
                      {collegeCategory.description}
                    </p>
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors text-base px-8 py-3 rounded-md shadow-md group-hover:shadow-lg"
                      asChild
                    >
                      <Link href={`/products?category=${collegeCategory.slug}`}>
                        Shop College Uniforms <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl order-1 md:order-2">
                    <Image
                      src={collegeCategory.imageUrl}
                      alt={collegeCategory.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      data-ai-hint={collegeCategory['data-ai-hint']}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent md:bg-gradient-to-t md:from-black/30 md:via-transparent md:to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  </div>
                </div>
              </div>
            )}
            
            {!schoolCategory && !collegeCategory && (
              <p className="text-center text-muted-foreground">No categories to display at the moment.</p>
            )}
          </div>
        </section>
        

        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Featured Uniforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-16">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105" 
                  asChild
                >
                  <Link href="/products">
                    Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 md:py-24 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
             <Gift className="h-16 w-16 mx-auto mb-6 text-accent-foreground/80" />
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Give Back with UniShop</h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto text-accent-foreground/90">
              Join our mission to support students in need. Your old uniforms can make a big difference.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background text-accent border-transparent hover:bg-background/90 text-lg px-10 py-4 rounded-md shadow-lg transition-transform hover:scale-105" 
              asChild
            >
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

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');


    

    