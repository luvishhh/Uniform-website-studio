
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts, mockOrders, mockUsers, getProductById, getUserById } from "@/lib/mockData";
import type { Product, InstitutionUser, StudentUser, User, Order, CartItem } from "@/types";
import { FileText, Building, UserCircle, Users, ShoppingCart, Star, UserCheck, Package as PackageIcon, Calendar as CalendarIcon, ListChecks, ListOrdered } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import type { DateRange } from "react-day-picker";
import { format, parseISO, isWithinInterval, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#FF4040', '#40FF4F'];

// Helper to get initials
const getInitials = (name: string = "") => {
  if (!name) return "U";
  const names = name.split(' ');
  return names.map(n => n[0]).join('').toUpperCase() || 'U';
};


export default function InstitutionDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<InstitutionUser | null>(null);
  const [institutionProducts, setInstitutionProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for analytics
  const [registeredStudents, setRegisteredStudents] = useState<StudentUser[]>([]);
  const [purchasingStudentsDetails, setPurchasingStudentsDetails] = useState<Array<StudentUser & { purchasedItems: CartItem[], totalSpent: number }>>([]);
  const [totalUniformOrdersCount, setTotalUniformOrdersCount] = useState(0);
  const [mostPopularProduct, setMostPopularProduct] = useState<{ name: string; quantity: number }>({ name: "N/A", quantity: 0 });

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = new Date(2023, 6, 1); 
    const to = new Date(2023, 11, 31); 
    return { from, to };
  });

  useEffect(() => {
    const fetchInstitutionData = async () => {
      setIsLoading(true);
      let fetchedInstitution: InstitutionUser | null = null;
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;
      const storedUserRole = typeof window !== "undefined" ? localStorage.getItem('unishop_user_role') : null;

      if (storedUserId && storedUserRole === 'institution') {
        try {
          const userRes = await fetch(`/api/user/${storedUserId}`);
          if (userRes.ok) {
            const apiUserData: User = await userRes.json();
            if (apiUserData.role === 'institution') {
              fetchedInstitution = apiUserData as InstitutionUser;
            } else {
               console.warn(`User ID ${storedUserId} is not an institution role. Will default to demo data.`);
            }
          } else {
            console.warn(`Failed to fetch user data for ID: ${storedUserId}, status: ${userRes.status}. Will default to demo data.`);
          }
        } catch (error) {
          console.warn("Error fetching logged-in institution from API. Will default to demo data.", error);
        }
      }

      if (fetchedInstitution) {
        setCurrentUser(fetchedInstitution);
        const products = mockProducts.filter(p =>
          p.institution &&
          fetchedInstitution.institutionName &&
          p.institution.toLowerCase() === fetchedInstitution.institutionName.toLowerCase()
        );
        setInstitutionProducts(products);
      } else {
        // Fallback to default institution if no valid user is fetched
        console.log("No valid logged-in institution found or role mismatch. Defaulting to 'Greenwood High' (inst_1) for dashboard demonstration.");
        const defaultInstitution = mockUsers.find(u => u.id === 'inst_1' && u.role === 'institution') as InstitutionUser | undefined;
        if (defaultInstitution) {
            setCurrentUser(defaultInstitution); // Set state for currentUser
            const products = mockProducts.filter(p => // Recalculate products for default user
                p.institution &&
                defaultInstitution.institutionName &&
                p.institution.toLowerCase() === defaultInstitution.institutionName.toLowerCase()
            );
            setInstitutionProducts(products); // Set state for institutionProducts
        } else {
            console.error("Default institution 'inst_1' (Greenwood High) not found in mockUsers. Dashboard may be empty.");
            toast({ title: "Error", description: "Could not load default institution data for the dashboard.", variant: "destructive"});
        }
      }
      setIsLoading(false);
    };
    fetchInstitutionData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]); 

  useEffect(() => {
    if (currentUser && currentUser.role === 'institution' && currentUser.institutionName) {
      const institutionNameLower = currentUser.institutionName.toLowerCase();

      const studentsOfInstitution = mockUsers.filter(
        (u): u is StudentUser => 
          u.role === 'student' &&
          typeof (u as StudentUser).schoolCollegeName === 'string' &&
          (u as StudentUser).schoolCollegeName.toLowerCase() === institutionNameLower
      );
      setRegisteredStudents(studentsOfInstitution);

      let purchasingStudentsMap = new Map<string, { student: StudentUser, purchasedItems: CartItem[], totalSpent: number }>();
      let totalOrdersForInstitutionCount = 0;
      const productSaleCounts: Record<string, number> = {};

      mockOrders.forEach(order => {
        let orderContainsInstitutionProduct = false;
        let orderItemsForInstitution: CartItem[] = [];

        order.items.forEach(item => {
          const productDetails = getProductById(item.productId);
          if (productDetails && productDetails.institution && productDetails.institution.toLowerCase() === institutionNameLower) {
            orderContainsInstitutionProduct = true;
            orderItemsForInstitution.push(item);
            productSaleCounts[item.productId] = (productSaleCounts[item.productId] || 0) + item.quantity;
          }
        });

        if (orderContainsInstitutionProduct) {
          totalOrdersForInstitutionCount++;
          const orderUser = getUserById(order.userId);
          if (orderUser && orderUser.role === 'student' &&
              typeof (orderUser as StudentUser).schoolCollegeName === 'string' &&
              (orderUser as StudentUser).schoolCollegeName.toLowerCase() === institutionNameLower) {
            
            const studentData = orderUser as StudentUser;
            const existingEntry = purchasingStudentsMap.get(studentData.id);
            if (existingEntry) {
              existingEntry.purchasedItems.push(...orderItemsForInstitution);
              existingEntry.totalSpent += orderItemsForInstitution.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
            } else {
              purchasingStudentsMap.set(studentData.id, {
                student: studentData,
                purchasedItems: [...orderItemsForInstitution],
                totalSpent: orderItemsForInstitution.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0)
              });
            }
          }
        }
      });
      
      const detailedPurchasers = Array.from(purchasingStudentsMap.values()).map(entry => ({
        ...entry.student,
        purchasedItems: entry.purchasedItems,
        totalSpent: entry.totalSpent
      }));
      setPurchasingStudentsDetails(detailedPurchasers);
      setTotalUniformOrdersCount(totalOrdersForInstitutionCount);

      let topProduct = { name: "N/A", quantity: 0 };
      if (Object.keys(productSaleCounts).length > 0) {
        const mostSoldProductId = Object.keys(productSaleCounts).reduce((a, b) =>
          productSaleCounts[a] > productSaleCounts[b] ? a : b
        );
        const mostSoldProductDetails = getProductById(mostSoldProductId);
        if (mostSoldProductDetails) {
          topProduct = { name: mostSoldProductDetails.name, quantity: productSaleCounts[mostSoldProductId] };
        }
      }
      setMostPopularProduct(topProduct);
    } else {
      setRegisteredStudents([]);
      setPurchasingStudentsDetails([]);
      setTotalUniformOrdersCount(0);
      setMostPopularProduct({ name: "N/A", quantity: 0 });
    }
  }, [currentUser]);


  const institutionSalesData = useMemo(() => {
    if (!currentUser || !institutionProducts.length || !currentUser.institutionName) return [];
    const institutionNameLower = currentUser.institutionName.toLowerCase();
    
    const monthlySales: Record<string, { sales: number, revenue: number, date: Date }> = {};

    mockOrders.forEach(order => {
      const orderDate = parseISO(order.orderDate);
      let validDateRange = true;
      if(dateRange?.from && dateRange?.to) {
        validDateRange = isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to });
      } else if (dateRange?.from) {
        validDateRange = orderDate >= dateRange.from;
      }
      if (!validDateRange) {
        return; 
      }

      order.items.forEach(item => {
        const productDetails = getProductById(item.productId);
        if (productDetails && productDetails.institution && productDetails.institution.toLowerCase() === institutionNameLower) {
          const monthKey = format(orderDate, 'MMM yy');
          if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = { sales: 0, revenue: 0, date: startOfMonth(orderDate) };
          }
          monthlySales[monthKey].sales += item.quantity;
          monthlySales[monthKey].revenue += item.price * item.quantity;
        }
      });
    });
    
    return Object.entries(monthlySales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a,b) => a.date.getTime() - b.date.getTime() );
  }, [currentUser, institutionProducts, dateRange]);

  const productSalesDistribution = useMemo(() => {
    if (!currentUser || !institutionProducts.length || !currentUser.institutionName) return [];
    const institutionNameLower = currentUser.institutionName.toLowerCase();
    const salesByProduct: Record<string, { name: string, value: number }> = {};

    mockOrders.forEach(order => {
        const orderDate = parseISO(order.orderDate);
        let validDateRange = true;
        if(dateRange?.from && dateRange?.to) {
            validDateRange = isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to });
        } else if (dateRange?.from) {
            validDateRange = orderDate >= dateRange.from;
        }
        if (!validDateRange) {
            return;
        }
        order.items.forEach(item => {
            const productDetails = getProductById(item.productId);
            if (productDetails && productDetails.institution && productDetails.institution.toLowerCase() === institutionNameLower) {
                if (!salesByProduct[productDetails.name]) {
                    salesByProduct[productDetails.name] = { name: productDetails.name, value: 0 };
                }
                salesByProduct[productDetails.name].value += item.quantity;
            }
        });
    });
    return Object.values(salesByProduct).sort((a,b) => b.value - a.value);
  }, [currentUser, institutionProducts, dateRange]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <Building className="h-12 w-12 text-destructive mr-3" />
        <div>
          <p className="text-xl font-semibold">Unable to Load Institution Data</p>
          <p className="text-muted-foreground">Please ensure you are logged in or try again later.</p>
          <Button onClick={() => router.push('/login')} className="mt-4">Go to Login</Button>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
            <Building className="h-12 w-12 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">
                    Welcome, {currentUser?.institutionName || "Institution"}!
                </h1>
                <p className="text-muted-foreground">This is your central hub for managing uniforms and orders.</p>
            </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Key Analytics Summary</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registeredStudents.length}</div>
                <p className="text-xs text-muted-foreground">Total students from {currentUser?.institutionName || "your institution"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Purchased Uniforms</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchasingStudentsDetails.length}</div>
                <p className="text-xs text-muted-foreground">Unique students who bought uniforms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uniform Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUniformOrdersCount}</div>
                <p className="text-xs text-muted-foreground">Orders containing your institution's uniforms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Popular Uniform</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate" title={mostPopularProduct.name}>{mostPopularProduct.name}</div>
                <p className="text-xs text-muted-foreground">{mostPopularProduct.quantity} units sold</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uniforms Listed</CardTitle>
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{institutionProducts.length}</div>
                <p className="text-xs text-muted-foreground">Unique uniform products for your institution</p>
              </CardContent>
            </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Sales & Product Analytics</h2>
        <div className="flex justify-end mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[260px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Trends for Your Institution's Uniforms</CardTitle>
            <CardDescription>Monthly units sold and revenue from your institution's specific uniforms.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {institutionSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={institutionSalesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                  <Legend wrapperStyle={{fontSize: "12px"}} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Units Sold" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">No sales data available for the selected date range or institution products.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uniform Sales Distribution by Product</CardTitle>
            <CardDescription>Breakdown of units sold per uniform type for your institution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            {productSalesDistribution.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={productSalesDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110} 
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {productSalesDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--background))"/>
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                            formatter={(value, name) => [`${value} units sold`, name]}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}} layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-muted-foreground text-center">No product sales data available for this institution or date range.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline mb-6">Student Information</h2>
        <Card>
          <CardHeader>
            <CardTitle>Registered Students from {currentUser?.institutionName}</CardTitle>
            <CardDescription>List of students registered with your institution.</CardDescription>
          </CardHeader>
          <CardContent>
            {registeredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Grade/Course</TableHead>
                    <TableHead>Parent Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.imageUrl || `https://placehold.co/40x40.png?text=${getInitials(student.fullName)}`} alt={student.fullName} data-ai-hint="student avatar" />
                            <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.gradeOrCourse}{student.year ? ` (${student.year})` : ''}</TableCell>
                      <TableCell>{student.parentContactNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">No students found registered for {currentUser?.institutionName}.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students Who Purchased Uniforms from {currentUser?.institutionName}</CardTitle>
            <CardDescription>Details of students from your institution who purchased uniforms.</CardDescription>
          </CardHeader>
          <CardContent>
             {purchasingStudentsDetails.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Purchased Items (Count)</TableHead>
                    <TableHead>Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasingStudentsDetails.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar className="h-9 w-9">
                            <AvatarImage src={student.imageUrl || `https://placehold.co/40x40.png?text=${getInitials(student.fullName)}`} alt={student.fullName} data-ai-hint="student avatar" />
                            <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="underline decoration-dashed cursor-help">
                                {student.purchasedItems.reduce((acc, item) => acc + item.quantity, 0)} items
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs p-2 bg-background border shadow-lg rounded-md">
                              <ul className="list-disc list-inside space-y-1">
                                {student.purchasedItems.map((item, idx) => (
                                  <li key={idx}>{item.name} (Qty: {item.quantity})</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>${student.totalSpent.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">No students from {currentUser?.institutionName} have purchased uniforms yet for the selected period.</p>
            )}
          </CardContent>
        </Card>
      </section>


      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Uniforms for {currentUser?.institutionName || "Your Institution"}</h2>
        {institutionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {institutionProducts.map(product => (
              <ProductCard key={product.id} product={product} isAdminView={false} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
                <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                    No specific uniforms are currently listed for {currentUser?.institutionName || "your institution"}.
                    <br />
                    Please contact support to update your uniform list.
                </p>
                 <Button variant="link" className="mt-4" asChild><Link href="/contact">Contact Support</Link></Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

