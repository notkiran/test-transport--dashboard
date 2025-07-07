import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleDrivers } from "@/data/sampleData";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";

export function Drivers() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Driver Management">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={sampleDrivers} />
        </CardContent>
      </Card>
    </div>
  );
}
