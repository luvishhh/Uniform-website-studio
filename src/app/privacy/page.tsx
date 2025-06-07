import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-10">Privacy Policy</h1>
        
        <ScrollArea className="h-[60vh] w-full rounded-md border p-6 bg-card shadow-lg">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <p>This Privacy Policy describes how UniShop ("we", "us", or "our") collects, uses, and discloses your personal information when you use our website (the "Service").</p>

            <h2 className="font-headline">1. Information We Collect</h2>
            <p>We may collect several types of information from and about users of our Service, including:
              <ul>
                <li><strong>Personal Information:</strong> Name, email address, postal address, phone number, payment information (processed by third-party payment processors), and other identifiers by which you may be contacted online or offline.</li>
                <li><strong>Usage Details:</strong> IP addresses, browser type, operating system, referring URLs, pages viewed, and access times.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> Information collected through cookies, web beacons, and other tracking technologies.</li>
              </ul>
            </p>

            <h2 className="font-headline">2. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:
              <ul>
                <li>Provide, operate, and maintain our Service.</li>
                <li>Process your transactions and manage your orders.</li>
                <li>Improve, personalize, and expand our Service.</li>
                <li>Understand and analyze how you use our Service.</li>
                <li>Develop new products, services, features, and functionality.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes.</li>
                <li>Send you emails.</li>
                <li>Find and prevent fraud.</li>
              </ul>
            </p>

            <h2 className="font-headline">3. Sharing Your Information</h2>
            <p>We may share your personal information in the following situations:
              <ul>
                <li><strong>With Service Providers:</strong> We may share your personal information with service providers to monitor and analyze the use of our Service, for payment processing, or to otherwise assist us in operating our Service.</li>
                <li><strong>For Business Transfers:</strong> We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                <li><strong>With Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
                <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              </ul>
            </p>

            <h2 className="font-headline">4. Data Security</h2>
            <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our Service.</p>

            <h2 className="font-headline">5. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict its use. Please contact us to exercise these rights.</p>
            
            <h2 className="font-headline">6. Children's Privacy</h2>
            <p>Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we take steps to remove that information from our servers.</p>

            <h2 className="font-headline">7. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2 className="font-headline">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@unishop.com.</p>
            
            <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </ScrollArea>
      </main>
      <Footer />
    </div>
  );
}
