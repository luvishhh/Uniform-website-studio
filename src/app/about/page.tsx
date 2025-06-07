import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Users, Target, ShieldCheck, Handshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-primary text-primary-foreground py-16 md:py-24 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">About UniShop</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
              Your trusted partner for high-quality school, corporate, and healthcare uniforms.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold font-headline mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  UniShop was founded with a simple mission: to simplify the process of purchasing uniforms while ensuring top-notch quality and customer satisfaction. We understand the importance of comfortable, durable, and professional attire, whether for students, corporate professionals, or healthcare heroes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform is designed to be a seamless, user-friendly, and secure online shopping experience. We are committed to innovation, sustainability, and supporting our communities through initiatives like our uniform donation program.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="https://placehold.co/600x400.png" 
                  alt="UniShop Team or Storefront" 
                  width={600} 
                  height={400} 
                  className="object-cover"
                  data-ai-hint="team diverse" 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold font-headline text-center mb-10">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Target, title: "Customer Focus", description: "Prioritizing your needs and satisfaction above all." },
                { icon: ShieldCheck, title: "Quality & Durability", description: "Offering uniforms made from high-quality materials, built to last." },
                { icon: Users, title: "Community Support", description: "Giving back through donations and supporting local initiatives." },
                { icon: Handshake, title: "Integrity & Trust", description: "Operating with transparency and building lasting relationships." },
              ].map(value => (
                <Card key={value.title} className="text-center p-6">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold font-headline mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
