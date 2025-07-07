import React, { useState, useMemo } from 'react';
import { ArrowLeft, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CustomerDetailsForm } from '@/components/CustomerDetailsForm';

import { cn } from '@/lib/utils';
import { Customer } from '@/lib/types';
import { sampleBranches } from '@/data/sampleData';

interface CreateBillProps {
  onBack: () => void;
}

const initialCustomerState: Customer = { name: '', phone: '', gst: '', address: '' };
const initialArticleState = { quantity: '', packageType: '', details: '', amount: '' };

export function CreateBill({ onBack }: CreateBillProps) {
  const [billDate, setBillDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  const [consignor, setConsignor] = useState<Customer>(initialCustomerState);
  const [consignee, setConsignee] = useState<Customer>(initialCustomerState);

  const [articles, setArticles] = useState([initialArticleState]);

  const [gstPaidBy, setGstPaidBy] = useState('consignor');
  const [chargeStatus, setChargeStatus] = useState('to_pay');
  const [charges, setCharges] = useState({ freight: '', surcharge: '', hamali: '', doorDelivery: '', other: '' });

  const handleAddArticle = () => {
    setArticles([...articles, initialArticleState]);
  };

  const handleRemoveArticle = (index: number) => {
    const newArticles = articles.filter((_, i) => i !== index);
    setArticles(newArticles);
  };

  const handleArticleChange = (index: number, field: string, value: string) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setArticles(newArticles);
  };

  const handleChargeChange = (field: string, value: string) => {
    setCharges(prev => ({ ...prev, [field]: value }));
  };

  const { totalQuantity, totalArticleAmount } = useMemo(() => {
    return articles.reduce((acc, article) => {
      const quantity = parseInt(article.quantity) || 0;
      const amount = parseFloat(article.amount) || 0;
      acc.totalQuantity += quantity;
      acc.totalArticleAmount += amount;
      return acc;
    }, { totalQuantity: 0, totalArticleAmount: 0 });
  }, [articles]);

  const totalCharges = useMemo(() => {
    return Object.values(charges).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  }, [charges]);

  const { subTotal, gst, grandTotal, isIntraState } = useMemo(() => {
    const subTotal = totalArticleAmount + totalCharges;
    const originBranch = sampleBranches.find(b => b.id === origin);
    const destinationBranch = sampleBranches.find(b => b.id === destination);
    const isIntraState = originBranch && destinationBranch && originBranch.state === destinationBranch.state;
    const gstRate = 0.18;
    const gst = subTotal * gstRate;
    const grandTotal = subTotal + gst;
    return { subTotal, gst, grandTotal, isIntraState };
  }, [totalArticleAmount, totalCharges, origin, destination]);

  const handleGenerateBill = () => {
    toast.success("Bill Generated!", {
      description: `Grand Total: ₹${grandTotal.toFixed(2)}`,
    });
    onBack();
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Bill</h1>
      </div>

      {/* Section 1: Basic Details */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="bill-date">Bill Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !billDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {billDate ? format(billDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={billDate} onSelect={setBillDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origin Branch</Label>
            <Select onValueChange={setOrigin} value={origin}>
              <SelectTrigger><SelectValue placeholder="Select origin" /></SelectTrigger>
              <SelectContent>{sampleBranches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination Branch</Label>
            <Select onValueChange={setDestination} value={destination}>
              <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
              <SelectContent>{sampleBranches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          <CustomerDetailsForm title="Consignor (Sender)" customer={consignor} setCustomer={setConsignor} />
          <CustomerDetailsForm title="Consignee (Receiver)" customer={consignee} setCustomer={setConsignee} />
        </CardContent>
      </Card>

      {/* Section 3: Article Details */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile View: Card per article */}
          <div className="space-y-4 md:hidden">
            {articles.map((article, index) => (
              <div key={index} className="relative p-4 border rounded-lg bg-muted/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`quantity-mob-${index}`}>Quantity</Label>
                    <Input id={`quantity-mob-${index}`} placeholder="e.g., 10" value={article.quantity} onChange={e => handleArticleChange(index, 'quantity', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`packageType-mob-${index}`}>Package Type</Label>
                    <Input id={`packageType-mob-${index}`} placeholder="e.g., Box, Crate" value={article.packageType} onChange={e => handleArticleChange(index, 'packageType', e.target.value)} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor={`details-mob-${index}`}>Article Details</Label>
                    <Input id={`details-mob-${index}`} placeholder="e.g., Cotton Bales, Machine Parts" value={article.details} onChange={e => handleArticleChange(index, 'details', e.target.value)} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor={`amount-mob-${index}`}>Amount (₹)</Label>
                    <Input id={`amount-mob-${index}`} placeholder="e.g., 5000" value={article.amount} onChange={e => handleArticleChange(index, 'amount', e.target.value)} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10 disabled:text-muted-foreground disabled:hover:bg-transparent"
                  onClick={() => handleRemoveArticle(index)}
                  disabled={articles.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Desktop View: Table-like grid */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_auto] gap-x-4 items-center pb-2 mb-2 border-b">
              <Label>Quantity</Label>
              <Label>Package Type</Label>
              <Label>Article Details</Label>
              <Label className="text-right">Amount (₹)</Label>
              <span className="w-9 h-1"></span> {/* Spacer for delete button */}
            </div>
            <div className="space-y-3">
              {articles.map((article, index) => (
                <div key={index} className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_auto] gap-x-4 items-start">
                  <Input id={`quantity-desk-${index}`} placeholder="e.g., 10" value={article.quantity} onChange={e => handleArticleChange(index, 'quantity', e.target.value)} />
                  <Input id={`packageType-desk-${index}`} placeholder="e.g., Box, Crate" value={article.packageType} onChange={e => handleArticleChange(index, 'packageType', e.target.value)} />
                  <Input id={`details-desk-${index}`} placeholder="e.g., Cotton Bales" value={article.details} onChange={e => handleArticleChange(index, 'details', e.target.value)} />
                  <Input id={`amount-desk-${index}`} placeholder="e.g., 5000" value={article.amount} onChange={e => handleArticleChange(index, 'amount', e.target.value)} className="text-right" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-500/10 disabled:text-muted-foreground disabled:hover:bg-transparent"
                    onClick={() => handleRemoveArticle(index)}
                    disabled={articles.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleAddArticle} className="mt-4"><Plus className="mr-2 h-4 w-4" /> Add Another Article</Button>
        </CardContent>
        <CardFooter className="flex justify-end gap-8 bg-muted/50 p-4 rounded-b-lg">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Quantity</p>
            <p className="font-bold text-lg">{totalQuantity}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-bold text-lg">₹{totalArticleAmount.toFixed(2)}</p>
          </div>
        </CardFooter>
      </Card>

      {/* Section 4: Costing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Costing Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Label>GST Paid By</Label>
            <RadioGroup value={gstPaidBy} onValueChange={setGstPaidBy} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="consignor" id="r1" /><Label htmlFor="r1">Consignor</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="consignee" id="r2" /><Label htmlFor="r2">Consignee</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="transport" id="r3" /><Label htmlFor="r3">Transport</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-4">
            <Label>Charge Status</Label>
            <RadioGroup value={chargeStatus} onValueChange={setChargeStatus} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="paid" id="s1" /><Label htmlFor="s1">Paid</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="to_pay" id="s2" /><Label htmlFor="s2">To Pay</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="tbb" id="s3" /><Label htmlFor="s3">TBB</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-1"><Label>Freight Charge</Label><Input value={charges.freight} onChange={e => handleChargeChange('freight', e.target.value)} /></div>
            <div className="space-y-1"><Label>Surcharge</Label><Input value={charges.surcharge} onChange={e => handleChargeChange('surcharge', e.target.value)} /></div>
            <div className="space-y-1"><Label>Hamali Charges</Label><Input value={charges.hamali} onChange={e => handleChargeChange('hamali', e.target.value)} /></div>
            <div className="space-y-1"><Label>Door Delivery</Label><Input value={charges.doorDelivery} onChange={e => handleChargeChange('doorDelivery', e.target.value)} /></div>
            <div className="space-y-1"><Label>Other Charges</Label><Input value={charges.other} onChange={e => handleChargeChange('other', e.target.value)} /></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-8 bg-muted/50 p-4 rounded-b-lg">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Charges</p>
            <p className="font-bold text-lg">₹{totalCharges.toFixed(2)}</p>
          </div>
        </CardFooter>
      </Card>

      {/* Section 5: Grand Total */}
      <Card className="bg-secondary text-secondary-foreground">
        <CardHeader>
          <CardTitle>Grand Total</CardTitle>
          <CardDescription className="text-secondary-foreground/80">Final bill amount including all charges and taxes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm ml-auto text-right">
            <div className="flex justify-between"><p>Sub Total (Articles + Charges):</p><p>₹{subTotal.toFixed(2)}</p></div>
            <Separator />
            {isIntraState ? (
              <>
                <div className="flex justify-between"><p>CGST (9%):</p><p>+ ₹{(gst / 2).toFixed(2)}</p></div>
                <div className="flex justify-between"><p>SGST (9%):</p><p>+ ₹{(gst / 2).toFixed(2)}</p></div>
              </>
            ) : (
              <div className="flex justify-between"><p>IGST (18%):</p><p>+ ₹{gst.toFixed(2)}</p></div>
            )}
            <Separator className="my-2 bg-secondary-foreground/20" />
            <div className="flex justify-between font-bold text-xl"><p>Grand Total:</p><p>₹{grandTotal.toFixed(2)}</p></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button size="lg" onClick={handleGenerateBill}>Generate Bill</Button>
      </div>
    </div>
  );
}
