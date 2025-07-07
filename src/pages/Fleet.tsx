import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleDrivers, sampleVehicles } from "@/data/sampleData";
import { MoreHorizontal, PlusCircle } from "lucide-react";

export function Fleet() {
  const getDriverName = (driverId: string | null) => {
    if (!driverId) return <span className="text-muted-foreground">Not Assigned</span>;
    return sampleDrivers.find(d => d.id === driverId)?.name || 'Unknown';
  };

  const getStatusBadge = (status: 'On Road' | 'Available' | 'Maintenance') => {
    switch (status) {
      case 'On Road':
        return <Badge className="bg-blue-500 text-white">On Road</Badge>;
      case 'Available':
        return <Badge className="bg-green-500 text-white">Available</Badge>;
      case 'Maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Fleet Management">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg. Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permit Expiry</TableHead>
                <TableHead>Maintenance Due</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{getDriverName(vehicle.driverId)}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>{vehicle.permitExpiry}</TableCell>
                  <TableCell>{vehicle.maintenanceDue}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
