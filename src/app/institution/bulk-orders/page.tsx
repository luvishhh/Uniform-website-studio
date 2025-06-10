
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

export default function InstitutionBulkOrdersPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/institution/dashboard">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Bulk Order Inquiries</h1>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Bulk Uniform Orders</CardTitle>
          <CardDescription>
            This section will allow institutions to submit inquiries for bulk uniform purchases and track their status.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <PackagePlus className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-xl font-semibold mb-3">Feature Coming Soon!</h2>
          <p className="text-muted-foreground">
            Our bulk order inquiry system is currently under development.
            <br />
            For bulk orders, please reach out to our sales team directly.
          </p>
           <Button className="mt-6" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    