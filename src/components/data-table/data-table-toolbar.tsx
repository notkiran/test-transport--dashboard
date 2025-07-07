"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Search, SlidersHorizontal, Trash2 } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumnId: string
  filterPlaceholder: string
  onDeleteSelected?: (selectedRows: TData[]) => void
}

export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterPlaceholder,
  onDeleteSelected,
}: DataTableToolbarProps<TData>) {
  const numSelected = table.getFilteredSelectedRowModel().rows.length;

  const handleDelete = () => {
    if (!onDeleteSelected || numSelected === 0) return;
    const selectedData = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    onDeleteSelected(selectedData);
    table.resetRowSelection();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px] pl-9"
          />
        </div>
        {numSelected > 0 && onDeleteSelected && (
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({numSelected})
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/([A-Z])/g, ' $1')}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
