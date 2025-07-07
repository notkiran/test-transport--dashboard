"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Driver } from "@/lib/types"
import { sampleVehicles } from "@/data/sampleData"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ArrowUpDown, FilePenLine, MoreHorizontal, Trash2 } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

const getVehicleReg = (vehicleId: string | null) => {
  if (!vehicleId) return <span className="text-muted-foreground">N/A</span>;
  const vehicle = sampleVehicles.find(v => v.id === vehicleId);
  return vehicle ? <span className="font-mono bg-muted px-2 py-1 rounded-md text-xs">{vehicle.registrationNumber}</span> : <span className="text-muted-foreground">Unknown</span>;
};

interface DriverColumnActions {
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export const getDriverColumns = ({ onEdit, onDelete }: DriverColumnActions): ColumnDef<Driver>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Salary (₹)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "phone",
    header: "Mobile",
  },
  {
    accessorKey: "licenseNumber",
    header: "License Number",
  },
  {
    accessorKey: "licenseExpiry",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          License Expiry
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => new Date(row.getValue("licenseExpiry")).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
  },
  {
    accessorKey: "vehicleId",
    header: "Assigned Vehicle",
    cell: ({ row }) => getVehicleReg(row.getValue("vehicleId")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const driver = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(driver)}>
              <FilePenLine className="mr-2 h-4 w-4" />
              Edit / View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => onDelete(driver)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Keep the old export for other tables that might be using it, though none are yet.
export { getDriverColumns as columns };
