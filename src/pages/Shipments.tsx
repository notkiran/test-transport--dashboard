import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleShipments } from "@/data/sampleData";
import { Shipment } from "@/lib/types";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

export function Shipments() {
  const renderShipmentTable = (shipments: Shipment[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>LR No.</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Consignee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((shipment) => (
          <TableRow key={shipment.id}>
            <TableCell className="font-medium">{shipment.id}</TableCell>
            <TableCell>{shipment.date}</TableCell>
            <TableCell>{shipment.origin}</TableCell>
            <TableCell>{shipment.destination}</TableCell>
            <TableCell>{shipment.consignee.name}</TableCell>
            <TableCell>
              <Badge variant={
                shipment.status === 'Delivered' ? 'default' : 
                shipment.status === 'In Transit' ? 'secondary' : 
                'destructive'
              } className={shipment.status === 'Delivered' ? 'bg-green-500' : ''}>
                {shipment.status}
              </Badge>
            </TableCell>
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
                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                  <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Shipments">
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <File className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Shipment
          </Button>
        </div>
      </PageHeader>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <TabsContent value="all">
              {renderShipmentTable(sampleShipments)}
            </TabsContent>
            <TabsContent value="pending">
              {renderShipmentTable(sampleShipments.filter(s => s.status === 'Pending'))}
            </TabsContent>
            <TabsContent value="in_transit">
              {renderShipmentTable(sampleShipments.filter(s => s.status === 'In Transit'))}
            </TabsContent>
            <TabsContent value="delivered">
              {renderShipmentTable(sampleShipments.filter(s => s.status === 'Delivered'))}
            </TabsContent>
            <TabsContent value="cancelled">
              {renderShipmentTable(sampleShipments.filter(s => s.status === 'Cancelled'))}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
