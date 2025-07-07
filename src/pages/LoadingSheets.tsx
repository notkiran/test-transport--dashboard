import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleDrivers, sampleLoadingSheets, sampleVehicles } from "@/data/sampleData";
import { MoreHorizontal, PlusCircle, Printer } from "lucide-react";

export function LoadingSheets() {
  const getVehicleReg = (vehicleId: string) => {
    return sampleVehicles.find(v => v.id === vehicleId)?.registrationNumber || 'Unknown';
  };

  const getDriverName = (driverId: string) => {
    return sampleDrivers.find(d => d.id === driverId)?.name || 'Unknown';
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Loading Sheets">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Sheet
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Loading Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle No.</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Shipments</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleLoadingSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell className="font-medium">{sheet.id}</TableCell>
                  <TableCell>{sheet.date}</TableCell>
                  <TableCell>{getVehicleReg(sheet.vehicleId)}</TableCell>
                  <TableCell>{getDriverName(sheet.driverId)}</TableCell>
                  <TableCell>{sheet.route}</TableCell>
                  <TableCell>{sheet.shipmentIds.length}</TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem><Printer className="mr-2 h-4 w-4" /> Print Sheet</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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
