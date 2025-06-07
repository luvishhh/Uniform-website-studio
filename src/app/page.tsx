
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/CategoryCard";
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
import React from "react";

const carouselSlides = [
  {
    imageSrc: "https://placehold.co/1920x1080.png",
    imageAlt: "Students in high-quality UniShop uniforms",
    "data-ai-hint": "students group modern",
    headline: "Dress for Success. Discover UniShop.",
    description: "Premium quality school, corporate, and healthcare uniforms designed for comfort and durability.",
    buttonText: "Shop All Collections",
    buttonLink: "/products",
    contentPosition: "center",
  },
  {
    imageSrc: "https://placehold.co/1920x1080.png",
    imageAlt: "Close-up of UniShop uniform fabric",
    "data-ai-hint": "fabric texture close-up",
    headline: "Quality You Can Feel, Style They'll Love.",
    description: "Our uniforms blend professional style with everyday practicality, ensuring your team or students always look their best.",
    buttonText: "Explore School Uniforms",
    buttonLink: "/products?category=school",
    contentPosition: "left",
  },
  {
    imageSrc: "https://placehold.co/1920x1080.png",
    imageAlt: "UniShop donation program visual",
    "data-ai-hint": "uniforms donation drive",
    headline: "Give Back with UniShop.",
    description: "Join our uniform donation program and help us make a difference in the community. It's easy and impactful.",
    buttonText: "Learn About Donations",
    buttonLink: "/donate",
    contentPosition: "right",
  },
];


export default function HomePage() {
  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 4);
  const schoolCategory = mockCategories.find(cat => cat.slug === 'school');
  const collegeCategory = mockCategories.find(cat => cat.slug === 'college');
  const autoplay = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }));


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - New Carousel Design */}
        <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden group">
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay.current]}
            className="w-full h-full"
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
                  <div className="absolute inset-0 bg-black/40"></div> {/* Darkening Overlay */}
                  <div className={cn(
                    "absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24 text-white",
                    slide.contentPosition === "center" && "items-center text-center",
                    slide.contentPosition === "left" && "items-start text-left",
                    slide.contentPosition === "right" && "items-end text-right"
                  )}>
                    <div className={cn(
                        "max-w-lg md:max-w-xl lg:max-w-2xl bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-xl",
                         slide.contentPosition === "center" && "text-center",
                         slide.contentPosition === "left" && "text-left",
                         slide.contentPosition === "right" && "text-right"
                      )}
                    >
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline mb-4 md:mb-6 leading-tight text-shadow-md">
                        {slide.headline}
                      </h1>
                      <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-shadow-sm opacity-90">
                        {slide.description}
                      </p>
                      <Button
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 px-8 py-3 text-base"
                        asChild
                      >
                        <Link href={slide.buttonLink} className="flex items-center">
                          {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <CarouselPrevious className="bg-background/70 hover:bg-background text-foreground border-border hover:border-primary h-10 w-10 md:h-12 md:w-12" />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <CarouselNext className="bg-background/70 hover:bg-background text-foreground border-border hover:border-primary h-10 w-10 md:h-12 md:w-12" />
            </div>
            <CarouselDots className="bottom-6 md:bottom-8"/>
          </Carousel>
        </section>


        {/* Why Choose Us Section */}
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

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Our Uniform Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {schoolCategory && (
                <CategoryCard category={schoolCategory} />
              )}
              {collegeCategory && (
                <CategoryCard category={collegeCategory} />
              )}
            </div>
          </div>
        </section>
        

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Featured Uniforms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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

        {/* Donation Call to Action */}
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

// Helper cn function if not globally available
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
