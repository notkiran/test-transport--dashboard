import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { Customer } from '@/lib/types';
import { sampleShipments } from '@/data/sampleData';

interface CustomerDetailsFormProps {
  title: string;
  customer: Customer;
  setCustomer: (customer: Customer) => void;
}

const getUniqueCustomers = (): Customer[] => {
  const customers = new Map<string, Customer>();
  sampleShipments.forEach(shipment => {
    if (!customers.has(shipment.consignor.name)) {
      customers.set(shipment.consignor.name, shipment.consignor);
    }
    if (!customers.has(shipment.consignee.name)) {
      customers.set(shipment.consignee.name, shipment.consignee);
    }
  });
  return Array.from(customers.values());
};

export function CustomerDetailsForm({ title, customer, setCustomer }: CustomerDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const customers = useMemo(() => getUniqueCustomers(), []);

  const handleSelectCustomer = (currentValue: string) => {
    const selected = customers.find(c => c.name.toLowerCase() === currentValue);
    if (selected) {
      setCustomer({
        name: selected.name,
        phone: selected.phone || '',
        gst: selected.gst,
        address: selected.address,
      });
    }
    setOpen(false);
  };

  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomer({ ...customer, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <Separator />
      <div className="space-y-2">
        <Label>Customer Name</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {customer.name || "Select or create customer..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput 
                placeholder="Search customer..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>
                  <Button variant="ghost" className="w-full" onClick={() => {
                    handleInputChange('name', search);
                    setOpen(false);
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add "{search}"
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {customers.map((c) => (
                    <CommandItem
                      key={c.name}
                      value={c.name}
                      onSelect={handleSelectCustomer}
                    >
                      <Check className={cn("mr-2 h-4 w-4", customer.name === c.name ? "opacity-100" : "opacity-0")} />
                      {c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>Mobile Number</Label>
        <Input value={customer.phone} onChange={e => handleInputChange('phone', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>GSTIN Number</Label>
        <Input value={customer.gst} onChange={e => handleInputChange('gst', e.target.value)} />
      </div>
    </div>
  );
}
