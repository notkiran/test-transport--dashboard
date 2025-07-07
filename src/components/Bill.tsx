import { Bill as BillType, Shipment, Vehicle, Driver } from "@/lib/types";
import { format } from "date-fns";

interface BillProps {
  bill: BillType;
  shipment: Shipment;
  vehicle?: Vehicle;
  driver?: Driver;
}

export function Bill({ bill, shipment, vehicle, driver }: BillProps) {
  const isIntraState = shipment.origin.split(', ')[1] === shipment.destination.split(', ')[1];
  const totalArticleAmount = bill.articles.reduce((sum, item) => sum + item.amount, 0);
  const totalCharges = Object.values(bill.charges).reduce((sum, charge) => sum + charge, 0);

  const renderChargeRow = (label: string, value: number) => {
    if (value > 0) {
      return (
        <tr>
          <td colSpan={4} className="text-right pr-4">{label}</td>
          <td className="text-right">₹{value.toLocaleString('en-IN')}</td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="bg-white text-black p-8 font-sans printable-area">
      <header className="flex justify-between items-center pb-4 border-b-2 border-black">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Vahan Sarthi</h1>
          <p className="text-gray-600">Your Trusted Logistics Partner</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <p className="text-sm"><strong>Bill No:</strong> {bill.id}</p>
          <p className="text-sm"><strong>Date:</strong> {format(new Date(bill.date), 'dd/MM/yyyy')}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-8 my-6">
        <div>
          <h3 className="font-bold mb-2 underline">Consignor (From)</h3>
          <p className="font-semibold">{shipment.consignor.name}</p>
          <p>{shipment.consignor.address}</p>
          {shipment.consignor.phone && <p>Phone: {shipment.consignor.phone}</p>}
          {shipment.consignor.gst && <p>GSTIN: {shipment.consignor.gst}</p>}
        </div>
        <div className="text-right">
          <h3 className="font-bold mb-2 underline">Consignee (To)</h3>
          <p className="font-semibold">{shipment.consignee.name}</p>
          <p>{shipment.consignee.address}</p>
          {shipment.consignee.phone && <p>Phone: {shipment.consignee.phone}</p>}
          {shipment.consignee.gst && <p>GSTIN: {shipment.consignee.gst}</p>}
        </div>
      </section>

      <section className="my-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="border-y border-gray-300">
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Package Type</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-right">Weight (Kg)</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.articles.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.packageType}</td>
                <td className="p-2">{item.details}</td>
                <td className="p-2 text-right">{index === 0 ? shipment.weight.toLocaleString('en-IN') : '-'}</td>
                <td className="p-2 text-right">₹{item.amount.toLocaleString('en-IN')}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan={4} className="text-right p-2 pr-4">Total Article Amount</td>
              <td className="text-right p-2">₹{totalArticleAmount.toLocaleString('en-IN')}</td>
            </tr>
            {renderChargeRow("Freight Charges", bill.charges.freight)}
            {renderChargeRow("Surcharge", bill.charges.surcharge)}
            {renderChargeRow("Hamali Charges", bill.charges.hamali)}
            {renderChargeRow("Door Delivery", bill.charges.doorDelivery)}
            {renderChargeRow("Other Charges", bill.charges.other)}
          </tbody>
        </table>
      </section>

      <section className="grid grid-cols-2 gap-8 my-6">
        <div>
          <h3 className="font-bold mb-2">Shipment Details</h3>
          <p><strong>LR No:</strong> {shipment.id}</p>
          {vehicle && <p><strong>Vehicle No:</strong> {vehicle.registrationNumber}</p>}
          {driver && <p><strong>Driver Name:</strong> {driver.name}</p>}
          <p><strong>Charge Status:</strong> <span className="font-semibold">{bill.chargeStatus}</span></p>
        </div>
        <div className="text-right">
          <table className="w-full max-w-xs float-right">
            <tbody>
              <tr>
                <td className="py-1 pr-4">Subtotal:</td>
                <td className="py-1 font-semibold">₹{bill.subtotal.toLocaleString('en-IN')}</td>
              </tr>
              {isIntraState ? (
                <>
                  <tr><td className="py-1 pr-4">CGST (9%):</td><td className="py-1 font-semibold">+ ₹{bill.cgst.toLocaleString('en-IN')}</td></tr>
                  <tr><td className="py-1 pr-4">SGST (9%):</td><td className="py-1 font-semibold">+ ₹{bill.sgst.toLocaleString('en-IN')}</td></tr>
                </>
              ) : (
                <tr><td className="py-1 pr-4">IGST (18%):</td><td className="py-1 font-semibold">+ ₹{bill.igst.toLocaleString('en-IN')}</td></tr>
              )}
              <tr className="border-t-2 border-black font-bold text-lg">
                <td className="pt-2 pr-4">Grand Total:</td>
                <td className="pt-2">₹{bill.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="pt-4 border-t text-xs text-gray-600">
        <p><strong>Terms &amp; Conditions:</strong> Payment due within 30 days. Please make all cheques payable to Vahan Sarthi Logistics.</p>
        <p className="text-center mt-4">Thank you for your business!</p>
      </footer>
    </div>
  );
}
