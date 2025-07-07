import { Bill as BillType, Shipment, Vehicle, Driver } from '@/lib/types';
import { Separator } from './ui/separator';
import { Truck } from 'lucide-react';

interface BillProps {
  bill: BillType;
  shipment: Shipment;
  vehicle: Vehicle | undefined;
  driver: Driver | undefined;
}

export function Bill({ bill, shipment, vehicle, driver }: BillProps) {
  const numberToWords = (num: number): string => {
    const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != '00') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim().toUpperCase() + ' ONLY';
  };

  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-8 print-container">
      <header className="flex justify-between items-start pb-4 border-b-2 border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 flex items-center"><Truck className="mr-2"/> Vahan Sarthi Logistics</h1>
          <p>123 Transport Nagar, Mumbai, Maharashtra, 400001</p>
          <p>GSTIN: 27ABCDE1234F1Z5 | Email: contact@vahansarthi.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase">Tax Bill</h2>
          <p><span className="font-semibold">Original for Recipient</span></p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 my-4">
        <div>
          <h3 className="font-bold mb-1">Billed To:</h3>
          <p>{shipment.consignor.name}</p>
          <p>{shipment.consignor.address}</p>
          <p>GSTIN: {shipment.consignor.gst}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Bill No:</span> {bill.id}</p>
          <p><span className="font-semibold">Bill Date:</span> {bill.date}</p>
          <p><span className="font-semibold">Due Date:</span> {bill.dueDate}</p>
          <p><span className="font-semibold">LR No:</span> {shipment.id}</p>
        </div>
        <div>
          <h3 className="font-bold mb-1">Shipped To:</h3>
          <p>{shipment.consignee.name}</p>
          <p>{shipment.consignee.address}</p>
          <p>GSTIN: {shipment.consignee.gst}</p>
        </div>
        <div className="text-right">
            <p><span className="font-semibold">Vehicle No:</span> {vehicle?.registrationNumber}</p>
            <p><span className="font-semibold">Driver:</span> {driver?.name}</p>
            <p><span className="font-semibold">Origin:</span> {shipment.origin}</p>
            <p><span className="font-semibold">Destination:</span> {shipment.destination}</p>
        </div>
      </section>

      <Separator className="my-4 bg-gray-400" />

      <table className="w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Description of Services</th>
            <th className="p-2">HSN/SAC</th>
            <th className="p-2 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{item.description}</td>
              <td className="p-2">{item.hsnCode}</td>
              <td className="p-2 text-right">{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="grid grid-cols-2 mt-4">
        <div>
          <p className="font-bold">Amount in Words:</p>
          <p className="text-sm">{numberToWords(bill.total)}</p>
        </div>
        <div className="text-right">
          <div className="grid grid-cols-2 gap-x-4">
            <p>Subtotal:</p><p>₹{bill.subtotal.toFixed(2)}</p>
            {bill.cgst > 0 && <>
              <p>CGST (9%):</p><p>₹{bill.cgst.toFixed(2)}</p>
              <p>SGST (9%):</p><p>₹{bill.sgst.toFixed(2)}</p>
            </>}
            {bill.igst > 0 && <>
              <p>IGST (18%):</p><p>₹{bill.igst.toFixed(2)}</p>
            </>}
            <p className="font-bold border-t-2 border-gray-800 pt-1 mt-1">Total:</p>
            <p className="font-bold border-t-2 border-gray-800 pt-1 mt-1">₹{bill.total.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <Separator className="my-4 bg-gray-400" />

      <footer className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-bold mb-2">Terms & Conditions</h4>
          <ol className="list-decimal list-inside text-xs">
            <li>Payment due within 30 days.</li>
            <li>Interest @18% p.a. will be charged on overdue bills.</li>
            <li>All disputes subject to Mumbai jurisdiction.</li>
          </ol>
        </div>
        <div className="text-right">
          <h4 className="font-bold mb-2">For Vahan Sarthi Logistics</h4>
          <div className="h-16"></div>
          <p className="border-t border-gray-400 pt-1">Authorised Signatory</p>
        </div>
      </footer>
    </div>
  );
}
