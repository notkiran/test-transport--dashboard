import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Search, SlidersHorizontal, Trash2, X, Eye } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BillForm } from './bills/BillForm';

import { sampleBranches, sampleBills, sampleShipments } from "@/data/sampleData";
import { Bill as BillType } from "@/lib/types";
import { cn } from "@/lib/utils";

const initialFilters = {
  searchTerm: '',
  fromLocation: '',
  toLocation: '',
  amountFrom: '',
  amountTo: '',
  billStatus: '',
  chargeStatus: '',
};

export function Billing() {
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [bills, setBills] = useState<BillType[]>(sampleBills);
  const [editingBill, setEditingBill] = useState<BillType | null>(null);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setDateRange(undefined);
  };

  const filteredData = useMemo(() => {
    return bills.map(bill => {
      const shipment = sampleShipments.find(s => s.id === bill.shipmentId);
      return { ...bill, shipment };
    }).filter(item => {
      if (!item.shipment) return false;
      const { shipment } = item;
      const searchTermLower = filters.searchTerm.toLowerCase();
      if (filters.searchTerm && !item.id.toLowerCase().includes(searchTermLower) && !shipment.consignor.name.toLowerCase().includes(searchTermLower) && !shipment.consignee.name.toLowerCase().includes(searchTermLower)) return false;
      if (filters.fromLocation) {
        const fromBranch = sampleBranches.find(b => b.id === filters.fromLocation);
        if (fromBranch?.city !== shipment.origin.split(',')[0]) return false;
      }
      if (filters.toLocation) {
        const toBranch = sampleBranches.find(b => b.id === filters.toLocation);
        if (toBranch?.city !== shipment.destination.split(',')[0]) return false;
      }
      if (filters.amountFrom && item.total < parseFloat(filters.amountFrom)) return false;
      if (filters.amountTo && item.total > parseFloat(filters.amountTo)) return false;
      const billDate = new Date(item.date);
      if (dateRange?.from && billDate < dateRange.from) return false;
      if (dateRange?.to && billDate > addDays(dateRange.to, 1)) return false;
      if (filters.billStatus && item.status !== filters.billStatus) return false;
      if (filters.chargeStatus && item.chargeStatus !== filters.chargeStatus) return false;
      return true;
    });
  }, [filters, dateRange, bills]);

  const getStatusBadge = (status: 'Paid' | 'Unpaid' | 'Overdue') => {
    switch (status) {
      case 'Paid': return <Badge className="bg-green-100 text-green-800 border-green-300" variant="outline">Paid</Badge>;
      case 'Unpaid': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300" variant="outline">Unpaid</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-800 border-red-300" variant="outline">Overdue</Badge>;
    }
  };

  const handleAddClick = () => {
    setEditingBill(null);
    setView('add');
  };

  const handleViewClick = (bill: BillType) => {
    setEditingBill(bill);
    setView('details');
  };

  const handleBack = () => {
    setView('list');
    setEditingBill(null);
  };

  const handleDelete = (billId: string) => {
    toast.error(`Are you sure you want to delete bill ${billId}?`, {
      action: { label: 'Delete', onClick: () => {
        setBills(prev => prev.filter(b => b.id !== billId));
        toast.success(`Bill ${billId} has been deleted.`);
      }},
      cancel: { label: 'Cancel' },
    });
  };

  const handleSubmit = (data: BillType) => {
    if (editingBill) { // Update
      setBills(prev => prev.map(b => b.id === data.id ? data : b));
      toast.success(`Bill ${data.id} has been updated.`);
    } else { // Create
      const newBill = { ...data, id: `B${String(bills.length + 101).slice(1)}` };
      setBills(prev => [newBill, ...prev]);
      toast.success(`New bill ${newBill.id} has been created.`);
    }
    handleBack();
  };

  if (view === 'add' || view === 'details') {
    return <BillForm initialData={editingBill} onBack={handleBack} onSubmit={handleSubmit} />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Billing">
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Bill
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
          <div className="space-y-4 pt-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by Bill No, Consignor, or Consignee..." className="pl-10" value={filters.searchTerm} onChange={e => handleFilterChange('searchTerm', e.target.value)} />
              </div>
              <Button variant="outline" onClick={() => setIsFiltersVisible(!isFiltersVisible)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            {isFiltersVisible && (
              <div className="p-4 bg-muted/50 rounded-lg border space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>From Location</Label><Select value={filters.fromLocation} onValueChange={val => handleFilterChange('fromLocation', val)}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{sampleBranches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>To Location</Label><Select value={filters.toLocation} onValueChange={val => handleFilterChange('toLocation', val)}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{sampleBranches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Date Range</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Any</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent></Popover></div>
                  <div className="space-y-2"><Label>Amount Range</Label><div className="flex items-center gap-2"><Input placeholder="From" type="number" value={filters.amountFrom} onChange={e => handleFilterChange('amountFrom', e.target.value)} /><span>-</span><Input placeholder="To" type="number" value={filters.amountTo} onChange={e => handleFilterChange('amountTo', e.target.value)} /></div></div>
                  <div className="space-y-2"><Label>Bill Status</Label><Select value={filters.billStatus} onValueChange={val => handleFilterChange('billStatus', val)}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Unpaid">Unpaid</SelectItem><SelectItem value="Overdue">Overdue</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Charge Status</Label><Select value={filters.chargeStatus} onValueChange={val => handleFilterChange('chargeStatus', val)}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="To Pay">To Pay</SelectItem><SelectItem value="TBB">TBB</SelectItem></SelectContent></Select></div>
                </div>
                <div className="flex justify-end"><Button variant="ghost" onClick={resetFilters}><X className="mr-2 h-4 w-4" /> Reset Filters</Button></div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Bill No.</TableHead><TableHead>Date</TableHead><TableHead>Consignor</TableHead><TableHead>Consignee</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{format(new Date(item.date), 'dd MMM, yyyy')}</TableCell>
                  <TableCell>{item.shipment?.consignor.name}</TableCell>
                  <TableCell>{item.shipment?.consignee.name}</TableCell>
                  <TableCell className="text-right">₹{item.total.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewClick(item)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (<TableRow><TableCell colSpan={7} className="h-24 text-center">No bills found.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
