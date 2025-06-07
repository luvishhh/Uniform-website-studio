
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, Activity, Calendar as CalendarIcon } from "lucide-react";
import { ResponsiveContainer, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import React, { useState, useMemo } from "react";
import { mockProducts, mockOrders, getProductById, mockCategories } from "@/lib/mockData"; // Ensure mockCategories is imported
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const fullSalesData = [
  { date: new Date(2023, 0, 1), sales: 4000, revenue: 2400 }, 
  { date: new Date(2023, 1, 1), sales: 3000, revenue: 1398 }, 
  { date: new Date(2023, 2, 1), sales: 2000, revenue: 9800 }, 
  { date: new Date(2023, 3, 1), sales: 2780, revenue: 3908 }, 
  { date: new Date(2023, 4, 1), sales: 1890, revenue: 4800 }, 
  { date: new Date(2023, 5, 1), sales: 2390, revenue: 3800 }, 
  { date: new Date(2023, 6, 1), sales: 3200, revenue: 4200 }, 
  { date: new Date(2023, 7, 1), sales: 3500, revenue: 4500 }, 
  { date: new Date(2023, 8, 1), sales: 2800, revenue: 3900 }, 
  { date: new Date(2023, 9, 1), sales: 4100, revenue: 5200 }, 
  { date: new Date(2023, 10, 1), sales: 4500, revenue: 5800 },
  { date: new Date(2023, 11, 1), sales: 5000, revenue: 6500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#FF4040', '#40FF4F'];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 6, 1), 
    to: new Date(2023, 11, 31), 
  });

  const displayedSalesData = useMemo(() => {
    let dataToDisplay = fullSalesData.map(d => ({...d, name: format(d.date, 'MMM yy')}));
    if (dateRange?.from) {
      const fromDate = dateRange.from;
      const toDate = dateRange.to || fromDate; 
      const toEndOfDay = new Date(toDate);
      toEndOfDay.setHours(23, 59, 59, 999);
      dataToDisplay = dataToDisplay.filter(item => {
        const itemDate = item.date;
        return itemDate >= fromDate && itemDate <= toEndOfDay;
      });
    }
    return dataToDisplay;
  }, [dateRange]);

  const institutionStockDistributionData = useMemo(() => {
    const academicCategoryNames = mockCategories
      .filter(cat => cat.slug === 'school' || cat.slug === 'college')
      .map(cat => cat.name);

    if (academicCategoryNames.length === 0) {
      console.warn("School or College categories not found in mockData. Stock distribution pie chart may be empty.");
      return [];
    }

    const productsInAcademicCategories = mockProducts.filter(p => 
      academicCategoryNames.includes(p.category) && p.institution
    );
    
    const stockByInstitution: Record<string, number> = productsInAcademicCategories.reduce((acc, product) => {
      if (product.institution) {
        acc[product.institution] = (acc[product.institution] || 0) + product.stock;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stockByInstitution).map(([institutionName, stockValue]) => ({
      name: institutionName,
      value: stockValue,
    })).sort((a,b) => b.value - a.value);
  }, []);

  const institutionSalesDistributionData = useMemo(() => {
    const salesByInstitution: Record<string, number> = {};
    mockOrders.forEach(order => {
      order.items.forEach(item => {
        const productDetails = getProductById(item.productId);
        if (productDetails && productDetails.institution && (productDetails.category === 'School' || productDetails.category === 'College')) {
          salesByInstitution[productDetails.institution] = (salesByInstitution[productDetails.institution] || 0) + item.quantity;
        }
      });
    });
    return Object.entries(salesByInstitution).map(([institutionName, quantitySold]) => ({
      name: institutionName,
      value: quantitySold,
    })).sort((a, b) => b.value - a.value);
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Analytics Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5%</div>
            <p className="text-xs text-muted-foreground">+0.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$55.70</div>
            <p className="text-xs text-muted-foreground">+$2.50 from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active Now: 78</div>
            <p className="text-xs text-muted-foreground">Real-time user activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Monthly sales and revenue. Select a date range to filter.</CardDescription>
            </div>
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
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {displayedSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayedSalesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                      contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                      }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Units Sold" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">No sales data available for the selected date range.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Stock Distribution by Institution</CardTitle>
            <CardDescription>Current stock levels for School and College uniforms, broken down by institution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            {institutionStockDistributionData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={institutionStockDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110} 
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent, value }) => `${name}: ${value} units (${(percent * 100).toFixed(0)}%)`}
                        >
                            {institutionStockDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--background))"/>
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                            }}
                            formatter={(value, name) => [`${value} units in stock`, name]}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}} layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-muted-foreground text-center">No stock data by institution available or 'School'/'College' categories not found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uniform Sales by Institution</CardTitle>
            <CardDescription>Total uniform units sold (School and College), broken down by institution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            {institutionSalesDistributionData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={institutionSalesDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110} 
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent, value }) => `${name}: ${value} units sold (${(percent * 100).toFixed(0)}%)`}
                        >
                            {institutionSalesDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--background))"/>
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                            }}
                            formatter={(value, name) => [`${value} units sold`, name]}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}} layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-muted-foreground text-center">No sales data by institution available.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
