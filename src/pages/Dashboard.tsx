import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleShipments, sampleVehicles } from "@/data/sampleData";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Truck, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { month: "Jan", shipments: 186 },
  { month: "Feb", shipments: 305 },
  { month: "Mar", shipments: 237 },
  { month: "Apr", shipments: 273 },
  { month: "May", shipments: 209 },
  { month: "Jun", shipments: 214 },
  { month: "Jul", shipments: 350 },
];

export function Dashboard() {
  const totalRevenue = 82600;
  const totalShipments = sampleShipments.length;
  const vehiclesOnRoad = sampleVehicles.filter(v => v.status === 'On Road').length;
  const availableDrivers = 5;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Dashboard">
        <Button>Create New Shipment</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign} description="+20.1% from last month" />
        <StatCard title="Total Shipments" value={`+${totalShipments}`} icon={Package} description="+180.1% from last month" />
        <StatCard title="Vehicles on Road" value={`${vehiclesOnRoad} / ${sampleVehicles.length}`} icon={Truck} description="2 vehicles available" />
        <StatCard title="Active Drivers" value={`+${availableDrivers}`} icon={Users} description="+5 since last hour" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly shipment overview.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'hsl(var(--secondary))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                <Bar dataKey="shipments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>
              You have {sampleShipments.filter(s => s.status === 'In Transit').length} active shipments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>LR No.</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleShipments.slice(0, 5).map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <Badge variant={
                        shipment.status === 'Delivered' ? 'default' : 
                        shipment.status === 'In Transit' ? 'secondary' : 
                        'destructive'
                      } className={shipment.status === 'Delivered' ? 'bg-green-500' : ''}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
