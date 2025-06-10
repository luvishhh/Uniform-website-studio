
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

export default function InstitutionCatalogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/institution/dashboard">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Manage Uniform Catalog</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uniform Catalog Management</CardTitle>
          <CardDescription>
            This section will allow institutions to view, add, or request changes to their approved uniform list.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Wrench className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-xl font-semibold mb-3">Feature Coming Soon!</h2>
          <p className="text-muted-foreground">
            We are working hard to bring you a comprehensive catalog management system.
            <br />
            For immediate assistance, please contact UniShop support.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    