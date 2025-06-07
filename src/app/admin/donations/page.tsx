import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDonations } from "@/lib/mockData"; // Assuming you'll add this to mockData
import { Eye, CheckCircle, Archive } from "lucide-react";

// Add to src/lib/mockData.ts if not already present
/*
export const mockDonations: Donation[] = [
  { id: 'don_1', uniformType: 'School Shirts', quantity: 10, condition: 'Good', contactName: 'Jane Doe', contactEmail: 'jane@example.com', submissionDate: '2023-11-10', status: 'Pending' },
  { id: 'don_2', uniformType: 'Corporate Trousers', quantity: 5, condition: 'Like New', contactName: 'John Smith', contactEmail: 'john.s@example.com', submissionDate: '2023-11-05', status: 'Collected' },
  { id: 'don_3', uniformType: 'Healthcare Scrubs', quantity: 15, condition: 'Fair', contactName: 'Emily White', contactEmail: 'emily.w@example.com', submissionDate: '2023-10-20', status: 'Distributed' },
];
*/
// Make sure mockDonations is defined in your mockData.ts, or define it here for now:
const tempMockDonations = [
  { id: 'don_1', uniformType: 'School Shirts', quantity: 10, condition: 'Good', contactName: 'Jane Doe', contactEmail: 'jane@example.com', submissionDate: '2023-11-10', status: 'Pending' },
  { id: 'don_2', uniformType: 'Corporate Trousers', quantity: 5, condition: 'Like New', contactName: 'John Smith', contactEmail: 'john.s@example.com', submissionDate: '2023-11-05', status: 'Collected' },
  { id: 'don_3', uniformType: 'Healthcare Scrubs', quantity: 15, condition: 'Fair', contactName: 'Emily White', contactEmail: 'emily.w@example.com', submissionDate: '2023-10-20', status: 'Distributed' },
];


export default function AdminDonationsPage() {
  const donations = tempMockDonations; // Use mockDonations from lib/mockData in real scenario

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Manage Donations</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Donations</CardTitle>
          <CardDescription>Review and manage submitted uniform donations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Uniform Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map(donation => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {donation.contactName}
                    <br/><span className="text-xs text-muted-foreground">{donation.contactEmail}</span>
                  </TableCell>
                  <TableCell>{donation.uniformType}</TableCell>
                  <TableCell>{donation.quantity}</TableCell>
                  <TableCell>{donation.condition}</TableCell>
                  <TableCell>{new Date(donation.submissionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      donation.status === 'Collected' ? 'bg-blue-100 text-blue-700' :
                      donation.status === 'Distributed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{donation.status}</span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" title="View Details (mock)">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {donation.status === 'Pending' && (
                        <Button variant="ghost" size="icon" title="Mark as Collected (mock)" className="text-blue-600 hover:text-blue-700">
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}
                    {donation.status === 'Collected' && (
                        <Button variant="ghost" size="icon" title="Mark as Distributed (mock)" className="text-green-600 hover:text-green-700">
                            <Archive className="h-4 w-4" />
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {donations.length === 0 && <p className="text-center text-muted-foreground py-8">No donations found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
