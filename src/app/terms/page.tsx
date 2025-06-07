import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-10">Terms of Service</h1>
        
        <ScrollArea className="h-[60vh] w-full rounded-md border p-6 bg-card shadow-lg">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <h2 className="font-headline">1. Acceptance of Terms</h2>
            <p>By accessing or using the UniShop website (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>

            <h2 className="font-headline">2. Use of Service</h2>
            <p>UniShop grants you a limited, non-exclusive, non-transferable, revocable license to use the Service for your personal, non-commercial purposes. You agree not to use the Service for any other purpose, including any commercial purpose, without UniShop's express prior written consent.</p>
            <p>You agree not to:
              <ul>
                <li>Use the Service in any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm UniShop or users of the Service.</li>
                <li>Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose.</li>
              </ul>
            </p>

            <h2 className="font-headline">3. Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>

            <h2 className="font-headline">4. Product Information and Purchases</h2>
            <p>We attempt to be as accurate as possible in the description of products. However, we do not warrant that product descriptions or other content of the Service is accurate, complete, reliable, current, or error-free.</p>
            <p>All purchases through our site or other transactions for the sale of goods formed through the Service are governed by our Sales Policy, which is hereby incorporated into these Terms.</p>

            <h2 className="font-headline">5. Donation Program</h2>
            <p>Our donation program allows users to donate old uniforms. By participating, you agree that donated items are in reasonable condition and that UniShop reserves the right to determine the suitability and distribution of donated items.</p>
            
            <h2 className="font-headline">6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of UniShop and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

            <h2 className="font-headline">7. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

            <h2 className="font-headline">8. Limitation of Liability</h2>
            <p>In no event shall UniShop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2 className="font-headline">9. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which UniShop operates, without regard to its conflict of law provisions.</p>

            <h2 className="font-headline">10. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h2 className="font-headline">11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@unishop.com.</p>

            <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </ScrollArea>
      </main>
      <Footer />
    </div>
  );
}
