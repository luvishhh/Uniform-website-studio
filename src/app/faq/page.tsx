import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    question: 'What types of uniforms do you offer?',
    answer:
      'We offer a wide range of uniforms, including school uniforms for various institutions, professional corporate attire, and durable healthcare wear. Each category has multiple options for different needs.',
  },
  {
    question: 'How do I find the right size?',
    answer:
      "Each product page includes a detailed size chart. We recommend measuring yourself or your child according to the guide provided and comparing it with the chart. If you're between sizes, we generally suggest opting for the larger size.",
  },
  {
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of purchase for items that are unworn, unwashed, and in their original packaging with tags attached. Please visit our Returns & Exchanges page for detailed instructions and any exceptions.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping typically takes 5-7 business days within the continental US. Expedited shipping options are available at checkout. You will receive a tracking number once your order has shipped.',
  },
  {
    question: 'How can I track my order?',
    answer:
      "Once your order is shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also track your order status by logging into your UniShop account and navigating to the 'Order History' section.",
  },
  {
    question: 'How does the uniform donation program work?',
    answer:
      "You can donate your old, gently used uniforms through our Donation page. Fill out the form with details about the uniforms, and we'll provide instructions on how to send them to us or our partner NGOs. Your contribution helps those in need and promotes sustainability.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and other secure payment methods as indicated at checkout. All transactions are processed securely.',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      'Yes, we take your privacy and security very seriously. We use industry-standard encryption and security protocols to protect your personal information. Please review our Privacy Policy for more details.',
  },
]

export default function FAQPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16'>
        <section className='text-center mb-12 md:mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold font-headline'>
            Frequently Asked Questions
          </h1>
          <p className='mt-4 text-lg text-muted-foreground max-w-xl mx-auto'>
            Find answers to common questions about our products, services, and
            policies.
          </p>
        </section>

        <section className='max-w-3xl mx-auto'>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((faq, index) => (
              <AccordionItem
                value={`item-${index + 1}`}
                key={index}
                className='bg-card mb-3 rounded-lg shadow px-2 hover:shadow-md transition-shadow'
              >
                <AccordionTrigger className='text-left font-semibold py-4 px-4 hover:no-underline'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='py-2 px-4 text-muted-foreground leading-relaxed'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className='text-center mt-16'>
          <h2 className='text-2xl font-semibold font-headline mb-4'>
            Still have questions?
          </h2>
          <p className='text-muted-foreground mb-6'>
            Our support team is ready to assist you.
          </p>
          <Button
            size='lg'
            className='bg-accent hover:bg-accent/90 text-accent-foreground'
            asChild
          >
            <a href='/contact'>Contact Support</a>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
