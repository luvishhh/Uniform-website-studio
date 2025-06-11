
"use client";
import DealerSidebar from "@/components/dealer/DealerSidebar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('unishop_user_role') : null;
    if (role === 'dealer') {
      setIsAuthorized(true);
    } else {
      toast({
        title: "Access Denied",
        description: "You must be logged in as a dealer to view this page.",
        variant: "destructive",
      });
      router.replace('/login');
    }
    setIsLoading(false);
  }, [router, toast]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-4 text-muted-foreground">Verifying dealer access...</p>
        </div>
    );
  }

  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <DealerSidebar />
        <main className="flex-1 p-6 md:p-8 bg-muted/30 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
