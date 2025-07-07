import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, CalendarIcon, Plus, Trash2, Pencil, Printer } from 'lucide-react';
import { format, addDays } from 'date-fns';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomerDetailsForm } from '@/components/CustomerDetailsForm';
import { PageHeader } from '@/components/PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bill as BillComponent } from '@/components/Bill';

import { cn } from '@/lib/utils';
import { Customer, Bill as BillType, BillArticle, BillCharges, Shipment } from '@/lib/types';
import { sampleBranches, sampleShipments, sampleVehicles, sampleDrivers } from '@/data/sampleData';

interface BillFormProps {
  initialData?: BillType | null;
  onSubmit: (data: BillType) => void;
  onBack: () => void;
}

const initialCustomerState: Customer = { name: '', phone: '', gst: '', address: '' };
const initialArticleState = { quantity: '', packageType: '', details: '', amount: '' };
const initialChargesState = { freight: '', surcharge: '', hamali: '', doorDelivery: '', other: '' };

const DisplayField = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="text-base pt-2 h-10 flex items-center text-foreground/80 border-b border-transparent">
        {value || <span className="text-muted-foreground">N/A</span>}
      </div>
    </div>
);

export function BillForm({ initialData, onSubmit, onBack }: BillFormProps) {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [isPrinting, setIsPrinting] = useState(false);

  // Form State
  const [billDate, setBillDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [consignor, setConsignor] = useState<Customer>(initialCustomerState);
  const [consignee, setConsignee] = useState<Customer>(initialCustomerState);
  const [articles, setArticles] = useState([initialArticleState]);
  const [gstPaidBy, setGstPaidBy] = useState('consignor');
  const [chargeStatus, setChargeStatus] = useState('to_pay');
  const [charges, setCharges] = useState(initialChargesState);
  const [billStatus, setBillStatus] = useState<'Paid' | 'Unpaid' | 'Overdue'>('Unpaid');

  const shipment = useMemo(() => initialData ? sampleShipments.find(s => s.id === initialData.shipmentId) : null, [initialData]);

  useEffect(() => {
    if (initialData && shipment) {
      setBillDate(new Date(initialData.date));
      const originBranch = sampleBranches.find(b => shipment.origin.includes(b.city));
      const destinationBranch = sampleBranches.find(b => shipment.destination.includes(b.city));
      setOrigin(originBranch?.id || '');
      setDestination(destinationBranch?.id || '');
      setConsignor(shipment.consignor);
      setConsignee(shipment.consignee);
      setArticles(initialData.articles.map(a => ({...a, quantity: String(a.quantity), amount: String(a.amount)})));
      setCharges(Object.entries(initialData.charges).reduce((acc, [key, val]) => ({...acc, [key]: String(val)}), initialChargesState));
      setGstPaidBy(initialData.gstPaidBy);
      setChargeStatus(initialData.chargeStatus);
      setBillStatus(initialData.status);
    }
  }, [initialData, shipment]);

  const handleAddArticle = () => setArticles([...articles, initialArticleState]);
  const handleRemoveArticle = (index: number) => setArticles(articles.filter((_, i) => i !== index));
  const handleArticleChange = (index: number, field: string, value: string) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setArticles(newArticles);
  };
  const handleChargeChange = (field: string, value: string) => setCharges(prev => ({ ...prev, [field]: value }));

  const { totalQuantity, freightFromArticles } = useMemo(() => articles.reduce((acc, article) => {
    const quantity = parseInt(article.quantity) || 0;
    const rate = parseFloat(article.amount) || 0;
    acc.totalQuantity += quantity;
    acc.freightFromArticles += quantity * rate;
    return acc;
  }, { totalQuantity: 0, freightFromArticles: 0 }), [articles]);

  useEffect(() => {
    if (isEditing) {
      setCharges(prev => ({ ...prev, freight: freightFromArticles.toFixed(2) }));
    }
  }, [freightFromArticles, isEditing]);

  const { subTotal, cgst, sgst, igst, grandTotal } = useMemo(() => {
    const subTotal = Object.values(charges).reduce((sum, val) => sum + (parseFloat(String(val)) || 0), 0);

    let cgst = 0, sgst = 0, igst = 0;

    if (gstPaidBy === 'transport') {
        const freightValue = parseFloat(String(charges.freight)) || 0;
        cgst = freightValue * 0.025;
        sgst = freightValue * 0.025;
    } else {
        const originBranch = sampleBranches.find(b => b.id === origin);
        const destinationBranch = sampleBranches.find(b => b.id === destination);
        const isIntraState = !!(originBranch && destinationBranch && originBranch.state === destinationBranch.state);
        const gstOnSubtotal = subTotal * 0.18;
        if (isIntraState) {
            cgst = gstOnSubtotal / 2;
            sgst = gstOnSubtotal / 2;
        } else {
            igst = gstOnSubtotal;
        }
    }

    const grandTotal = subTotal + cgst + sgst + igst;
    return { subTotal, cgst, sgst, igst, grandTotal };
  }, [charges, gstPaidBy, origin, destination]);


  const handleFormSubmit = () => {
    if (!origin || !destination || !consignor.name || !consignee.name || articles.some(a => !a.quantity || !a.amount)) {
        toast.error("Please fill all required fields.");
        return;
    }

    const billData: BillType = {
      id: initialData?.id || '',
      shipmentId: initialData?.shipmentId || `LRN-TEMP-${Date.now()}`,
      date: billDate?.toISOString() || new Date().toISOString(),
      dueDate: addDays(billDate || new Date(), 30).toISOString(),
      status: billStatus,
      chargeStatus: chargeStatus as BillType['chargeStatus'],
      gstPaidBy: gstPaidBy as BillType['gstPaidBy'],
      articles: articles.map(a => ({
        quantity: parseInt(a.quantity) || 0,
        packageType: a.packageType,
        details: a.details,
        amount: parseFloat(a.amount) || 0,
      })),
      charges: Object.entries(charges).reduce((acc, [key, val]) => ({...acc, [key]: parseFloat(val) || 0}), {} as BillCharges),
      subtotal: subTotal,
      cgst,
      sgst,
      igst,
      total: grandTotal,
    };
    onSubmit(billData);
  };

  const title = initialData ? `Bill Details: ${initialData.id}` : "Create New Bill";
  const vehicle = useMemo(() => initialData && shipment ? sampleVehicles.find(v => v.id === shipment.vehicleId) : undefined, [initialData, shipment]);
  const driver = useMemo(() => vehicle ? sampleDrivers.find(d => d.id === vehicle.driverId) : undefined, [vehicle]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <PageHeader title={title} showBackButton onBack={onBack}>
        {!isEditing && initialData && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsPrinting(true)}><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button onClick={() => setIsEditing(true)}><Pencil className="mr-2 h-4 w-4" /> Edit Bill</Button>
          </div>
        )}
      </PageHeader>

      {/* Section 1: Basic Details */}
      <Card>
        <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {isEditing ? (
            <>
              <div className="space-y-2"><Label>Bill Date</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !billDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{billDate ? format(billDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={billDate} onSelect={setBillDate} initialFocus /></PopoverContent></Popover></div>
              <div className="space-y-2"><Label>Origin Branch</Label><Select onValueChange={setOrigin} value={origin}><SelectTrigger><SelectValue placeholder="Select origin" /></SelectTrigger><SelectContent>{sampleBranches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Destination Branch</Label><Select onValueChange={setDestination} value={destination}><SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger><SelectContent>{sampleBranches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
            </>
          ) : (
            <>
              <DisplayField label="Bill Date" value={billDate ? format(billDate, "PPP") : 'N/A'} />
              <DisplayField label="Origin Branch" value={sampleBranches.find(b => b.id === origin)?.name} />
              <DisplayField label="Destination Branch" value={sampleBranches.find(b => b.id === destination)?.name} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Customer Details */}
      <Card>
        <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          <CustomerDetailsForm title="Consignor (Sender)" customer={consignor} setCustomer={setConsignor} isEditing={isEditing} />
          <CustomerDetailsForm title="Consignee (Receiver)" customer={consignee} setCustomer={setConsignee} isEditing={isEditing} />
        </CardContent>
      </Card>

      {/* Section 3: Article Details */}
      <Card>
        <CardHeader><CardTitle>Article Details</CardTitle><CardDescription>The "Amount" field should be treated as a rate per unit quantity.</CardDescription></CardHeader>
        <CardContent>
          {isEditing ? (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_auto] gap-x-4 items-center pb-2 mb-2 border-b"><Label>Quantity</Label><Label>Package Type</Label><Label>Article Details</Label><Label className="text-right">Amount / Rate (₹)</Label><span className="w-9 h-1"></span></div>
                <div className="space-y-3">
                  {articles.map((article, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_auto] gap-x-4 items-start">
                      <Input placeholder="e.g., 10" value={article.quantity} onChange={e => handleArticleChange(index, 'quantity', e.target.value)} />
                      <Input placeholder="e.g., Box" value={article.packageType} onChange={e => handleArticleChange(index, 'packageType', e.target.value)} />
                      <Input placeholder="e.g., Cotton Bales" value={article.details} onChange={e => handleArticleChange(index, 'details', e.target.value)} />
                      <Input placeholder="e.g., 500" value={article.amount} onChange={e => handleArticleChange(index, 'amount', e.target.value)} className="text-right" />
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 disabled:text-muted-foreground" onClick={() => handleRemoveArticle(index)} disabled={articles.length === 1}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddArticle} className="mt-4"><Plus className="mr-2 h-4 w-4" /> Add Article</Button>
            </>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Quantity</TableHead><TableHead>Package Type</TableHead><TableHead>Details</TableHead><TableHead className="text-right">Rate</TableHead></TableRow></TableHeader>
              <TableBody>
                {articles.map((article, index) => (
                  <TableRow key={index}><TableCell>{article.quantity}</TableCell><TableCell>{article.packageType}</TableCell><TableCell>{article.details}</TableCell><TableCell className="text-right">₹{parseFloat(article.amount || '0').toLocaleString('en-IN')}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-8 bg-muted/50 p-4 rounded-b-lg">
          <div className="text-right"><p className="text-sm text-muted-foreground">Total Quantity</p><p className="font-bold text-lg">{totalQuantity}</p></div>
          <div className="text-right"><p className="text-sm text-muted-foreground">Total Article Value (Freight)</p><p className="font-bold text-lg">₹{freightFromArticles.toFixed(2)}</p></div>
        </CardFooter>
      </Card>

      {/* Section 4: Costing Details */}
      <Card>
        <CardHeader><CardTitle>Costing &amp; Status</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4"><Label>GST Paid By</Label>{isEditing ? <RadioGroup value={gstPaidBy} onValueChange={setGstPaidBy} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="consignor" id="r1" /><Label htmlFor="r1">Consignor</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="consignee" id="r2" /><Label htmlFor="r2">Consignee</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="transport" id="r3" /><Label htmlFor="r3">Transport</Label></div></RadioGroup> : <DisplayField label="" value={gstPaidBy} />}</div>
          <div className="space-y-4"><Label>Charge Status</Label>{isEditing ? <RadioGroup value={chargeStatus} onValueChange={setChargeStatus} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="Paid" id="s1" /><Label htmlFor="s1">Paid</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="To Pay" id="s2" /><Label htmlFor="s2">To Pay</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="TBB" id="s3" /><Label htmlFor="s3">TBB</Label></div></RadioGroup> : <DisplayField label="" value={chargeStatus} />}</div>
          <div className="space-y-4"><Label>Bill Status</Label>{isEditing ? <Select value={billStatus} onValueChange={(v) => setBillStatus(v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Unpaid">Unpaid</SelectItem><SelectItem value="Overdue">Overdue</SelectItem></SelectContent></Select> : <DisplayField label="" value={billStatus} />}</div>
        </CardContent>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
            {isEditing ? (
              <>
                <div className="space-y-1"><Label>Freight Charge</Label><Input value={charges.freight} disabled className="disabled:opacity-100 disabled:cursor-default bg-muted/50" /></div>
                <div className="space-y-1"><Label>Surcharge</Label><Input value={charges.surcharge} onChange={e => handleChargeChange('surcharge', e.target.value)} /></div>
                <div className="space-y-1"><Label>Hamali Charges</Label><Input value={charges.hamali} onChange={e => handleChargeChange('hamali', e.target.value)} /></div>
                <div className="space-y-1"><Label>Door Delivery</Label><Input value={charges.doorDelivery} onChange={e => handleChargeChange('doorDelivery', e.target.value)} /></div>
                <div className="space-y-1"><Label>Other Charges</Label><Input value={charges.other} onChange={e => handleChargeChange('other', e.target.value)} /></div>
                {gstPaidBy === 'transport' && (
                  <>
                    <div className="space-y-1"><Label>CGST (2.5%)</Label><Input value={cgst.toFixed(2)} disabled className="disabled:opacity-100 disabled:cursor-default bg-muted/50" /></div>
                    <div className="space-y-1"><Label>SGST (2.5%)</Label><Input value={sgst.toFixed(2)} disabled className="disabled:opacity-100 disabled:cursor-default bg-muted/50" /></div>
                  </>
                )}
              </>
            ) : (
              <>
                <DisplayField label="Freight Charge" value={`₹${charges.freight}`} />
                <DisplayField label="Surcharge" value={`₹${charges.surcharge}`} />
                <DisplayField label="Hamali Charges" value={`₹${charges.hamali}`} />
                <DisplayField label="Door Delivery" value={`₹${charges.doorDelivery}`} />
                <DisplayField label="Other Charges" value={`₹${charges.other}`} />
                {gstPaidBy === 'transport' && (
                  <>
                    <DisplayField label="CGST (2.5%)" value={`₹${cgst.toFixed(2)}`} />
                    <DisplayField label="SGST (2.5%)" value={`₹${sgst.toFixed(2)}`} />
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-8 bg-muted/50 p-4 rounded-b-lg">
          <div className="text-right"><p className="text-sm text-muted-foreground">Sub Total (Charges)</p><p className="font-bold text-lg">₹{subTotal.toFixed(2)}</p></div>
        </CardFooter>
      </Card>

      {/* Section 5: Grand Total */}
      <Card className="bg-secondary text-secondary-foreground">
        <CardHeader><CardTitle>Grand Total</CardTitle><CardDescription className="text-secondary-foreground/80">Final bill amount including all charges and taxes.</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm ml-auto text-right">
            <div className="flex justify-between"><p>Sub Total:</p><p>₹{subTotal.toFixed(2)}</p></div>
            <Separator />
            {igst > 0 && <div className="flex justify-between"><p>IGST (18%):</p><p>+ ₹{igst.toFixed(2)}</p></div>}
            {cgst > 0 && <div className="flex justify-between"><p>CGST:</p><p>+ ₹{cgst.toFixed(2)}</p></div>}
            {sgst > 0 && <div className="flex justify-between"><p>SGST:</p><p>+ ₹{sgst.toFixed(2)}</p></div>}
            <Separator className="my-2 bg-secondary-foreground/20" />
            <div className="flex justify-between font-bold text-xl"><p>Grand Total:</p><p>₹{grandTotal.toFixed(2)}</p></div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={initialData ? () => setIsEditing(false) : onBack}>Cancel</Button>
          <Button size="lg" onClick={handleFormSubmit}>{initialData ? 'Save Changes' : 'Generate Bill'}</Button>
        </div>
      )}

      {initialData && shipment && (
        <Dialog open={isPrinting} onOpenChange={setIsPrinting}>
          <DialogContent className="max-w-4xl p-0 border-0">
            <DialogHeader className="p-4 pb-0 no-print">
              <div className="flex justify-between items-center">
                <DialogTitle>Print Preview: {initialData.id}</DialogTitle>
                <Button onClick={() => window.print()} size="sm"><Printer className="mr-2 h-4 w-4" /> Print</Button>
              </div>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              <BillComponent bill={initialData} shipment={shipment} vehicle={vehicle} driver={driver} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
