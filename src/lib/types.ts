export type Page = 'dashboard' | 'branches' | 'fleet' | 'drivers' | 'shipments' | 'billing' | 'loading_sheets';

export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Delivery &amp; Pickup' | 'Delivery Only';
  contact: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: '20ft Container' | '40ft Container' | 'Open Body' | 'Tanker';
  driverId: string | null;
  status: 'On Road' | 'Available' | 'Maintenance';
  permitExpiry: string;
  maintenanceDue: string;
}

export interface Driver {
  id:string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleId: string | null;
  salary: number;
}

export interface Customer {
  name: string;
  address: string;
  gst: string;
  phone?: string; // Added for create bill form
}

export interface Shipment {
  id: string; // LR Number
  date: string;
  origin: string;
  destination: string;
  consignor: Customer;
  consignee: Customer;
  packages: { count: number; description: string; weight: number };
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  vehicleId: string;
  billId?: string;
}

export interface Bill {
  id: string;
  shipmentId: string;
  date: string;
  dueDate: string;
  clientName: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  chargeStatus: 'Paid' | 'To Pay' | 'TBB';
  items: { description: string; hsnCode: string; amount: number }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface LoadingSheet {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  route: string;
  shipmentIds: string[];
}
